
import { TransactionData } from './TransactionData';

export type FeatureID = number;

export class Cluster {
    public readonly itemFrequencies = new Map<FeatureID, number>();
    public totalItemsCount = 0;
    public transactionCount = 0;

    get uniqueItemsCount(): number {
        return this.itemFrequencies.size;
    }

    profitNumerator(repulsion: number): number {
        if (this.uniqueItemsCount === 0) return 0;
        const g = this.totalItemsCount / Math.pow(this.uniqueItemsCount, repulsion);
        return g * this.transactionCount;
    }

    predictedNumeratorAdding(txData: TransactionData, repulsion: number): number {
        const newTransactionCount = this.transactionCount + 1;
        let newTotalItems = this.totalItemsCount;
        let newUniqueCount = this.uniqueItemsCount;

        for (const [featureId, count] of txData) {
            newTotalItems += count;
            if (!this.itemFrequencies.has(featureId)) {
                newUniqueCount += 1;
            }
        }

        if (newUniqueCount === 0) return 0;
        const g = newTotalItems / Math.pow(newUniqueCount, repulsion);
        return g * newTransactionCount;
    }

    predictedNumeratorRemoving(txData: TransactionData, repulsion: number): number {
        if (this.transactionCount <= 1) return 0;

        const newTransactionCount = this.transactionCount - 1;
        let newTotalItems = this.totalItemsCount;
        let newUniqueCount = this.uniqueItemsCount;

        for (const [featureId, countToRemove] of txData) {
            const currentCount = this.itemFrequencies.get(featureId) ?? 0;
            if (currentCount === 0) continue;

            newTotalItems -= countToRemove;
            if (currentCount <= countToRemove) {
                newUniqueCount -= 1;
            }
        }

        if (newUniqueCount === 0) return 0;
        const g = newTotalItems / Math.pow(newUniqueCount, repulsion);
        return g * newTransactionCount;
    }

    add(txData: TransactionData): void {
        this.transactionCount += 1;

        for (const [featureId, count] of txData) {
            this.totalItemsCount += count;
            const currentCount = this.itemFrequencies.get(featureId) ?? 0;
            this.itemFrequencies.set(featureId, currentCount + count);
        }
    }

    remove(txData: TransactionData): void {
        this.transactionCount -= 1;

        for (const [featureId, countToRemove] of txData) {
            const currentCount = this.itemFrequencies.get(featureId);
            if (currentCount === undefined) continue;

            this.totalItemsCount -= countToRemove;

            if (currentCount > countToRemove) {
                this.itemFrequencies.set(featureId, currentCount - countToRemove);
            } else {
                this.itemFrequencies.delete(featureId);
            }
        }
    }
}