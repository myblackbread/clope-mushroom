import { TransactionChunk } from "../core/TransactionChunk";

export type ChunkID = number;

export class ClopeStorage {
    private dbName = "ClopeMushroomDB";
    private storeName = "chunks";
    private db: IDBDatabase | null = null;

    public async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };

            request.onerror = () => reject(request.error);

            request.onblocked = () => {
                reject(new Error("База данных заблокирована другой вкладкой. Пожалуйста, закройте другие вкладки с этим сайтом."));
            };
        });
    }


    public async saveChunk(chunk: TransactionChunk): Promise<void> {
        if (!this.db) throw new Error("DB не инициализирована");

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);

            const request = store.put({
                data: chunk.data,
                offsets: chunk.offsets,
            }, chunk.chunkId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async loadChunk(chunkId: ChunkID): Promise<TransactionChunk | null> {
        if (!this.db) throw new Error("DB не инициализирована");

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(chunkId);

            request.onsuccess = () => {
                if (request.result) {
                    resolve(new TransactionChunk(
                        chunkId,
                        request.result.data,
                        request.result.offsets,
                    ));
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    public async clear(): Promise<void> {
        if (!this.db) return;
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, "readwrite");
            const request = transaction.objectStore(this.storeName).clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
