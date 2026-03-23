
import { TransactionData } from './TransactionData';
import { Cluster } from './Cluster';

type ClusterID = number;
type DataIndex = number;

export class ClopePartition<Item> {
    public readonly repulsion: number;
    private readonly allTransactionsData: TransactionData<Item>[];

    private nextClusterId = 0;
    private clusters = new Map<ClusterID, Cluster<Item>>();
    private transactionToClusterIndex = new Map<DataIndex, ClusterID>();

    private totalTransactionCount = 0;
    private globalProfitNumerator = 0;

    get activeClusters(): Cluster<Item>[] {
        return Array.from(this.clusters.values());
    }

    get profit(): number | null {
        if (this.totalTransactionCount === 0) return null;
        return this.globalProfitNumerator / this.totalTransactionCount;
    }

    constructor(repulsion: number, transactions: TransactionData<Item>[] | Item[][]) {
        this.repulsion = repulsion;

        if (transactions.length > 0 && Array.isArray(transactions[0])) {
            this.allTransactionsData = (transactions as Item[][]).map(items => new TransactionData(items));
        } else {
            this.allTransactionsData = transactions as TransactionData<Item>[];
        }
    }

    private add(transactionID: number): void {
        const txData = this.allTransactionsData[transactionID];

        let bestClusterID: ClusterID | null = null;
        let maxDelta: number = -Infinity;

        const dummyCluster = new Cluster<Item>();

        const evaluateCluster = (clusterID: number, cluster: Cluster<Item>) => {
            const currentNumerator = cluster.profitNumerator(this.repulsion);
            const predictedNumerator = cluster.predictedNumeratorAdding(txData, this.repulsion);
            const delta = predictedNumerator - currentNumerator;

            if (bestClusterID === null || delta > maxDelta) {
                maxDelta = delta;
                bestClusterID = clusterID;
            }
        };

        const nextClusterId = this.nextClusterId;
        evaluateCluster(nextClusterId, dummyCluster);

        for (const [clusterID, cluster] of this.clusters) {
            evaluateCluster(clusterID, cluster);
        }

        if (bestClusterID === null) return;
        if (bestClusterID === nextClusterId) {
            this.clusters.set(nextClusterId, new Cluster<Item>());
            this.nextClusterId += 1;
        }

        this.clusters.get(bestClusterID)?.add(txData);
        this.transactionToClusterIndex.set(transactionID, bestClusterID);

        this.globalProfitNumerator += maxDelta;
        this.totalTransactionCount += 1;
    }

    private move(
        transactionID: number,
        txData: TransactionData<Item>,
        sourceID: ClusterID,
        sourceCluster: Cluster<Item>,
        targetID: ClusterID,
        targetCluster: Cluster<Item>
    ): void {
        const sourceOldNumerator = sourceCluster.profitNumerator(this.repulsion);
        const targetOldNumerator = targetCluster.profitNumerator(this.repulsion);

        sourceCluster.remove(txData);
        targetCluster.add(txData);

        if (sourceCluster.transactionCount === 0) {
            this.clusters.delete(sourceID);
        }

        this.transactionToClusterIndex.set(transactionID, targetID);

        const sourceNewNumerator = sourceCluster.profitNumerator(this.repulsion);
        const targetNewNumerator = targetCluster.profitNumerator(this.repulsion);

        this.globalProfitNumerator += (sourceNewNumerator - sourceOldNumerator) + (targetNewNumerator - targetOldNumerator);
    }

    public runPhaseOne(): void {
        for (let id = 0; id < this.allTransactionsData.length; id++) {
            this.add(id);
        }
    }

    public runPhaseTwo(maxIterations: number = 10): void {
        let moved = true;
        let iteration = 0;

        const dummyCluster = new Cluster<Item>();

        while (moved && iteration < maxIterations) {
            moved = false;
            iteration += 1;

            for (let transactionID = 0; transactionID < this.allTransactionsData.length; transactionID++) {
                const txData = this.allTransactionsData[transactionID];

                const sourceID = this.transactionToClusterIndex.get(transactionID);
                if (sourceID === undefined) {
                    throw new Error(`Critical Error: Transaction ${transactionID} is not mapped to any cluster.`);
                }

                const sourceCluster = this.clusters.get(sourceID);
                if (sourceCluster === undefined) {
                    throw new Error(`Critical Error: Cluster ${sourceID} is missing from the Map, but indexed by transaction ${transactionID}.`);
                }

                const sourceOldNumerator = sourceCluster.profitNumerator(this.repulsion);
                const sourceNewNumerator = sourceCluster.predictedNumeratorRemoving(txData, this.repulsion);
                const removeDelta = sourceNewNumerator - sourceOldNumerator;

                let bestTargetID: ClusterID | null = null;
                let maxAddDelta: number = -Infinity;

                const evaluateTarget = (targetID: ClusterID, targetCluster: Cluster<Item>) => {
                    const targetOldNumerator = targetCluster.profitNumerator(this.repulsion);
                    const targetNewNumerator = targetCluster.predictedNumeratorAdding(txData, this.repulsion);
                    const addDelta = targetNewNumerator - targetOldNumerator;

                    if (bestTargetID === null || addDelta > maxAddDelta) {
                        maxAddDelta = addDelta;
                        bestTargetID = targetID;
                    }
                };

                const nextClusterId = this.nextClusterId;
                evaluateTarget(nextClusterId, dummyCluster);

                for (const [targetID, targetCluster] of this.clusters) {
                    if (targetID === sourceID) continue;
                    evaluateTarget(targetID, targetCluster);
                }

                if (bestTargetID === null) continue;

                if ((removeDelta + maxAddDelta) > 1e-9) {

                    if (bestTargetID === nextClusterId) {
                        this.clusters.set(nextClusterId, new Cluster<Item>());
                        this.nextClusterId += 1;
                    }

                    const targetCluster = this.clusters.get(bestTargetID);

                    if (targetCluster === undefined) {
                        throw new Error(`Critical Error: Target cluster ${bestTargetID} was selected but not found in the Map.`);
                    }

                    this.move(transactionID, txData, sourceID, sourceCluster, bestTargetID, targetCluster);
                    moved = true;
                }
            }
        }
    }
}