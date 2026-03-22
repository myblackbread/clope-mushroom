
import { Cluster } from './Cluster';
import { TransactionData } from './TransactionData';

export class ClusterManager<Item> {
    public readonly clusters: Cluster<Item>[] = [];
    
    public readonly emptyIndices: Set<number> = new Set();
    public readonly activeIndices: Set<number> = new Set();
    
    get emptyCount(): number { return this.emptyIndices.size; }
    get activeCount(): number { return this.activeIndices.size; }
    
    ensureHasEmpty(): void {
        if (this.emptyCount === 0) {
            this.clusters.push(new Cluster<Item>());
            this.emptyIndices.add(this.clusters.length - 1);
        }
    }
    
    add(transactionID: number, txData: TransactionData<Item>, index: number): void {
        this.clusters[index].add(transactionID, txData);
        
        if (this.emptyIndices.has(index)) {
            this.emptyIndices.delete(index);
            this.activeIndices.add(index);
        }
    }
    
    remove(transactionID: number, txData: TransactionData<Item>, index: number): void {
        this.clusters[index].remove(transactionID, txData);
        
        if (this.clusters[index].transactionCount === 0) {
            this.activeIndices.delete(index);
            this.emptyIndices.add(index);
        }
    }
}