import { ClopePartition } from "../core";
import { TransactionData } from "../core";
import { ClusterInfo } from "../models/ClusterInfo";
import { MushroomFeature } from "./MushroomDataLoader";

export class MushroomClusterEngine {
    private transactionsData: TransactionData<MushroomFeature>[];
    private partition: ClopePartition<MushroomFeature> | null = null;

    constructor(transactionsData: TransactionData<MushroomFeature>[]) {
        this.transactionsData = transactionsData;
    }

    runPhaseOne(repulsion: number): { profit: number, clusters: ClusterInfo[] } {
        this.partition = new ClopePartition(repulsion, this.transactionsData);
        this.partition.runPhaseOne();
        return this.extractResults(this.partition);
    }

    runPhaseTwo(): { profit: number, clusters: ClusterInfo[] } | null {
        if (this.partition === null) return null;
        this.partition.runPhaseTwo(12);
        return this.extractResults(this.partition);
    }

    private extractResults(partition: ClopePartition<MushroomFeature>): { profit: number, clusters: ClusterInfo[] } {
        const activeClusters = partition.activeClusters;

        const edibleFeature: MushroomFeature = "0:e";
        const poisonousFeature: MushroomFeature = "0:p";

        const infoList: ClusterInfo[] = activeClusters.map(cluster => {
            const eCount = cluster.itemFrequencies.get(edibleFeature) ?? 0;
            const pCount = cluster.itemFrequencies.get(poisonousFeature) ?? 0;
            const size = cluster.transactionCount;

            const maxCount = Math.max(eCount, pCount);
            const purity = size > 0 ? (maxCount / size) * 100 : 0;
            const dominantType = eCount >= pCount ? "Съедобные 🥗" : "Ядовитые ☠️";

            const generateId = () => {
                if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                    return crypto.randomUUID();
                }
                return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            };

            return {
                id: generateId(),
                size,
                edibleCount: eCount,
                poisonousCount: pCount,
                purity,
                dominantType
            };
        });

        infoList.sort((a, b) => b.size - a.size);

        return { profit: partition.profit ?? 0, clusters: infoList };
    }
}