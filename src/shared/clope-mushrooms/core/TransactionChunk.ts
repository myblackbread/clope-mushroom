import { TransactionData } from "./TransactionData";

type ChunkID = number;

export class TransactionChunk {
    constructor(
        public readonly chunkId: ChunkID,
        public readonly data: number[],
        public readonly offsets: number[],
    ) { }

    get length(): number {
        return this.offsets.length;
    }

    getTransaction(localIndex: number): TransactionData {
        const start = this.offsets[localIndex];
        const end = localIndex + 1 < this.offsets.length ? this.offsets[localIndex + 1] : this.data.length;

        return new TransactionData(this.data, start, end);
    }
}