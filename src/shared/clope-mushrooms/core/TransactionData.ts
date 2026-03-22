
export class TransactionData<Item> {
    public readonly itemsCount: number;
    public readonly frequencies: Map<Item, number>;

    constructor(items: Item[]) {
        this.itemsCount = items.length;
        this.frequencies = new Map<Item, number>();
        
        for (const item of items) {
            const currentCount = this.frequencies.get(item) ?? 0;
            this.frequencies.set(item, currentCount + 1);
        }
    }
}