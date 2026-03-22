
import { TransactionData } from './TransactionData';

export class Cluster<Item> {
    public readonly transactions: Set<number> = new Set();
    public readonly itemFrequencies: Map<Item, number> = new Map();

    public totalItemsCount: number = 0;

    get uniqueItemsCount(): number {
        return this.itemFrequencies.size;
    }

    get transactionCount(): number {
        return this.transactions.size;
    }

    profitNumerator(repulsion: number): number {
        if (this.uniqueItemsCount === 0) return 0;
        const g = this.totalItemsCount / Math.pow(this.uniqueItemsCount, repulsion);
        return g * this.transactionCount;
    }

    predictedNumeratorAdding(txData: TransactionData<Item>, repulsion: number): number {
        const newTransactionCount = this.transactionCount + 1;
        const newTotalItems = this.totalItemsCount + txData.itemsCount;

        let newUniqueCount = this.uniqueItemsCount;
        for (const [item] of txData.frequencies) {
            if (!this.itemFrequencies.has(item)) {
                newUniqueCount += 1;
            }
        }

        const g = newTotalItems / Math.pow(newUniqueCount, repulsion);
        return g * newTransactionCount;
    }

    predictedNumeratorRemoving(txData: TransactionData<Item>, repulsion: number): number {
        if (this.transactionCount <= 1) return 0;

        const newTransactionCount = this.transactionCount - 1;
        const newTotalItems = this.totalItemsCount - txData.itemsCount;

        let newUniqueCount = this.uniqueItemsCount;
        for (const [item, countToRemove] of txData.frequencies) {
            const currentCount = this.itemFrequencies.get(item) ?? 0;
            if (currentCount <= countToRemove) {
                newUniqueCount -= 1;
            }
        }

        if (newUniqueCount === 0) return 0;
        const g = newTotalItems / Math.pow(newUniqueCount, repulsion);
        return g * newTransactionCount;
    }

    add(transactionID: number, txData: TransactionData<Item>): void {
        this.transactions.add(transactionID);
        this.totalItemsCount += txData.itemsCount;

        for (const [item, count] of txData.frequencies) {
            const currentCount = this.itemFrequencies.get(item) ?? 0;
            this.itemFrequencies.set(item, currentCount + count);
        }
    }

    remove(transactionID: number, txData: TransactionData<Item>): void {
        if (!this.transactions.delete(transactionID)) return;

        this.totalItemsCount -= txData.itemsCount;

        for (const [item, countToRemove] of txData.frequencies) {
            const currentCount = this.itemFrequencies.get(item);
            if (currentCount === undefined) continue;

            if (currentCount > countToRemove) {
                this.itemFrequencies.set(item, currentCount - countToRemove);
            } else {
                this.itemFrequencies.delete(item);
            }
        }
    }
}