
export class TransactionData {
    constructor(
        private readonly data: number[],
        private readonly startIndex: number,
        private readonly endIndex: number
    ) { }

    *[Symbol.iterator](): IterableIterator<[number, number]> {
        for (let i = this.startIndex; i < this.endIndex; i += 2) {
            if (i + 1 < this.endIndex) {
                yield [this.data[i], this.data[i + 1]];
            }
        }
    }
}