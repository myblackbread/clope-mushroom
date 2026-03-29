import { Cluster } from "../model/Cluster";
import { TransactionData } from "../../mushroom/model/TransactionData";
import { ClopeStorage } from "../storage/ClopeStorage";
import { ClusterInfo } from "../model/ClusterInfo";

export type ClusterID = number;
export type ChunkID = number;
export type FeatureID = number;

/**
 * Движок алгоритма CLOPE с поддержкой Out-of-Core вычислений.
 * Не хранит данные в RAM, а подгружает их пакетами из IndexedDB,
 * что позволяет кластеризовать датасеты неограниченного размера.
 */
export class MushroomClusterEngine {
    private storage: ClopeStorage;
    private totalChunks: number;
    private repulsion: number;

    constructor(storage: ClopeStorage, totalChunks: number, repulsion: number) {
        this.storage = storage;
        this.totalChunks = totalChunks;
        this.repulsion = repulsion;
    }

    private nextClusterId: ClusterID = 0;

    // Используется Map, а не массив, чтобы избежать проблем с "дырами" в индексах 
    // при удалении пустых кластеров на Фазе 2.
    private clusters = new Map<ClusterID, Cluster>();

    private assignments: ClusterID[] = [];

    // Глобальные метрики поддерживаются инкрементально (O(1) на каждую операцию).
    // Это избавляет от необходимости пересчитывать профит всех кластеров с нуля на каждой итерации.
    private globalProfitNumerator = 0;
    private totalTransactionCount = 0;

    public async runPhaseOne(): Promise<void> {
        for (let chunkId: ChunkID = 0; chunkId < this.totalChunks; chunkId++) {
            const chunk = await this.storage.loadChunk(chunkId);
            if (!chunk) continue;

            for (let i = 0; i < chunk.length; i++) {
                const txData = chunk.getTransaction(i);
                const assignedCluster = this.addTransaction(txData);
                this.assignments.push(assignedCluster);
            }

            // Фиксируем результаты распределения этого чанка на жестком диске
            await this.storage.saveChunk(chunk);
        }
    }

    public async runPhaseTwo(maxIterations: number = 10): Promise<void> {
        let moved = true;
        let iteration = 0;

        while (moved && iteration < maxIterations) {
            moved = false;
            iteration += 1;
            let globalTxIndex = 0;

            for (let chunkId: ChunkID = 0; chunkId < this.totalChunks; chunkId++) {
                const chunk = await this.storage.loadChunk(chunkId);
                if (!chunk) continue;

                for (let i = 0; i < chunk.length; i++) {
                    const txData = chunk.getTransaction(i);
                    const currentClusterID = this.assignments[globalTxIndex];

                    const newClusterID = this.optimizeTransaction(txData, currentClusterID);

                    if (newClusterID !== currentClusterID) {
                        this.assignments[globalTxIndex] = newClusterID;
                        moved = true;
                    }

                    globalTxIndex += 1;
                }
            }
        }
    }

    private addTransaction(txData: TransactionData): ClusterID {
        let bestClusterID = this.nextClusterId;
        let maxDelta: number = -Infinity;

        const dummyCluster = new Cluster();

        const evaluateCluster = (clusterID: ClusterID, cluster: Cluster) => {
            const currentNumerator = cluster.profitNumerator(this.repulsion);
            const predictedNumerator = cluster.predictedNumeratorAdding(txData, this.repulsion);
            const delta = predictedNumerator - currentNumerator;

            if (delta > maxDelta) {
                maxDelta = delta;
                bestClusterID = clusterID;
            }
        };

        evaluateCluster(this.nextClusterId, dummyCluster);

        for (const [clusterID, cluster] of this.clusters) {
            evaluateCluster(clusterID, cluster);
        }

        if (bestClusterID === this.nextClusterId) {
            this.clusters.set(this.nextClusterId, new Cluster());
            this.nextClusterId += 1;
        }

        this.clusters.get(bestClusterID)?.add(txData);
        this.globalProfitNumerator += maxDelta;
        this.totalTransactionCount += 1;

        return bestClusterID;
    }

    private optimizeTransaction(txData: TransactionData, sourceID: ClusterID): ClusterID {
        const sourceCluster = this.clusters.get(sourceID);
        if (!sourceCluster) return sourceID;

        const sourceOldNumerator = sourceCluster.profitNumerator(this.repulsion);
        const sourceNewNumerator = sourceCluster.predictedNumeratorRemoving(txData, this.repulsion);
        const removeDelta = sourceNewNumerator - sourceOldNumerator;

        let bestTargetID = this.nextClusterId;
        let maxAddDelta: number = -Infinity;
        const dummyCluster = new Cluster();

        const evaluateTarget = (targetID: ClusterID, targetCluster: Cluster) => {
            const targetOldNumerator = targetCluster.profitNumerator(this.repulsion);
            const targetNewNumerator = targetCluster.predictedNumeratorAdding(txData, this.repulsion);
            const addDelta = targetNewNumerator - targetOldNumerator;

            if (addDelta > maxAddDelta) {
                maxAddDelta = addDelta;
                bestTargetID = targetID;
            }
        };

        evaluateTarget(this.nextClusterId, dummyCluster);

        for (const [targetID, targetCluster] of this.clusters) {
            if (targetID === sourceID) continue; // Нет смысла перекладывать в себя же
            evaluateTarget(targetID, targetCluster);
        }

        // Защита от ошибок округления.
        // Профит должен вырасти хотя бы на микроскопическое значение (1e-9), 
        if ((removeDelta + maxAddDelta) > 1e-9) {
            if (bestTargetID === this.nextClusterId) {
                this.clusters.set(this.nextClusterId, new Cluster());
                this.nextClusterId += 1;
            }

            const targetCluster = this.clusters.get(bestTargetID)!;

            sourceCluster.remove(txData);

            // Обработка удаления осиротевшего кластера
            if (sourceCluster.transactionCount === 0) {
                this.clusters.delete(sourceID);
            }

            const targetOldNumerator = targetCluster.profitNumerator(this.repulsion);
            targetCluster.add(txData);
            const targetNewNumerator = targetCluster.profitNumerator(this.repulsion);

            this.globalProfitNumerator += removeDelta + (targetNewNumerator - targetOldNumerator);

            return bestTargetID;
        }

        return sourceID; // Перемещение невыгодно, оставляем на месте
    }

    /**
     * Конвертирует внутреннее математическое представление кластеров 
     * обратно в бизнес-модели для отображения в UI.
     */
    public getResults(edibleFeatureId: FeatureID, poisonousFeatureId: FeatureID): { profit: number, clusters: ClusterInfo[] } {
        const infoList: ClusterInfo[] = [];

        for (const [id, cluster] of this.clusters) {
            const eCount = cluster.itemFrequencies.get(edibleFeatureId) ?? 0;
            const pCount = cluster.itemFrequencies.get(poisonousFeatureId) ?? 0;
            const size = cluster.transactionCount;

            const maxCount = Math.max(eCount, pCount);
            const purity = size > 0 ? (maxCount / size) * 100 : 0;
            const dominantType = eCount >= pCount ? "🥗 Съедобные" : "☠️ Ядовитые";

            infoList.push({
                id: id.toString(),
                size,
                edibleCount: eCount,
                poisonousCount: pCount,
                purity,
                dominantType
            });
        }

        infoList.sort((a, b) => b.size - a.size);
        const currentProfit = this.totalTransactionCount === 0 ? 0 : this.globalProfitNumerator / this.totalTransactionCount;

        return { profit: currentProfit, clusters: infoList };
    }
}