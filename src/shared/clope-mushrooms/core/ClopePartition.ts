
import { TransactionData } from './TransactionData';
import { ClusterManager } from './ClusterManager';
import { Cluster } from './Cluster';

export class ClopePartition<Item> {
    public readonly repulsion: number;
    private readonly allTransactionsData: TransactionData<Item>[];
    
    private clusterManager = new ClusterManager<Item>();
    private transactionToClusterIndex: Map<number, number> = new Map();
    
    private totalTransactionCount: number = 0;
    private globalProfitNumerator: number = 0;
    
    get profit(): number {
        if (this.totalTransactionCount === 0) return 0;
        return this.globalProfitNumerator / this.totalTransactionCount;
    }
    
    get activeClusters(): Cluster<Item>[] {
        const active: Cluster<Item>[] = [];
        for (const index of this.clusterManager.activeIndices) {
            active.push(this.clusterManager.clusters[index]);
        }
        return active;
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
        this.clusterManager.ensureHasEmpty();
        
        let bestClusterIndex: number | null = null;
        let maxDelta: number = -Infinity;
        
        const evaluateCluster = (index: number) => {
            const currentNumerator = this.clusterManager.clusters[index].profitNumerator(this.repulsion);
            const predictedNumerator = this.clusterManager.clusters[index].predictedNumeratorAdding(txData, this.repulsion);
            const delta = predictedNumerator - currentNumerator;
            
            if (bestClusterIndex === null || delta > maxDelta) {
                maxDelta = delta;
                bestClusterIndex = index;
            }
        };
        
        for (const i of this.clusterManager.activeIndices) {
            evaluateCluster(i);
        }
        
        const firstEmpty = this.clusterManager.emptyIndices.values().next().value;
        if (firstEmpty !== undefined) {
            evaluateCluster(firstEmpty);
        }
        
        if (bestClusterIndex === null) return;
        
        this.clusterManager.add(transactionID, txData, bestClusterIndex);
        this.transactionToClusterIndex.set(transactionID, bestClusterIndex);
        
        this.globalProfitNumerator += maxDelta;
        this.totalTransactionCount += 1;
    }
    
    private move(transactionID: number, txData: TransactionData<Item>, sourceIndex: number, targetIndex: number): void {
        const sourceOldNumerator = this.clusterManager.clusters[sourceIndex].profitNumerator(this.repulsion);
        const targetOldNumerator = this.clusterManager.clusters[targetIndex].profitNumerator(this.repulsion);
        
        this.clusterManager.remove(transactionID, txData, sourceIndex);
        this.clusterManager.add(transactionID, txData, targetIndex);
        
        this.transactionToClusterIndex.set(transactionID, targetIndex);
        
        const sourceNewNumerator = this.clusterManager.clusters[sourceIndex].profitNumerator(this.repulsion);
        const targetNewNumerator = this.clusterManager.clusters[targetIndex].profitNumerator(this.repulsion);
        
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
        
        while (moved && iteration < maxIterations) {
            moved = false;
            iteration += 1;
            
            for (let transactionID = 0; transactionID < this.allTransactionsData.length; transactionID++) {
                const txData = this.allTransactionsData[transactionID];
                
                const sourceIndex = this.transactionToClusterIndex.get(transactionID);
                if (sourceIndex === undefined) continue;
                
                this.clusterManager.ensureHasEmpty();
                
                const sourceOldNumerator = this.clusterManager.clusters[sourceIndex].profitNumerator(this.repulsion);
                const sourceNewNumerator = this.clusterManager.clusters[sourceIndex].predictedNumeratorRemoving(txData, this.repulsion);
                const removeDelta = sourceNewNumerator - sourceOldNumerator;
                
                let bestTargetIndex: number | null = null;
                let maxAddDelta: number = -Infinity;
                
                const evaluateTarget = (index: number) => {
                    if (index === sourceIndex) return;
                    
                    const targetOldNumerator = this.clusterManager.clusters[index].profitNumerator(this.repulsion);
                    const targetNewNumerator = this.clusterManager.clusters[index].predictedNumeratorAdding(txData, this.repulsion);
                    const addDelta = targetNewNumerator - targetOldNumerator;
                    
                    if (bestTargetIndex === null || addDelta > maxAddDelta) {
                        maxAddDelta = addDelta;
                        bestTargetIndex = index;
                    }
                };
                
                for (const i of this.clusterManager.activeIndices) {
                    evaluateTarget(i);
                }
                
                const firstEmpty = this.clusterManager.emptyIndices.values().next().value;
                if (firstEmpty !== undefined) {
                    evaluateTarget(firstEmpty);
                }
                
                if (bestTargetIndex !== null && (removeDelta + maxAddDelta) > 1e-9) {
                    this.move(transactionID, txData, sourceIndex, bestTargetIndex);
                    moved = true;
                }
            }
        }
    }
}