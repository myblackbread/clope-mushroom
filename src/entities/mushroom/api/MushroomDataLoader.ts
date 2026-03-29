import { ClopeStorage } from "../../clope/storage/ClopeStorage";
import { TransactionChunk } from "../model/TransactionChunk";

export class MushroomDataLoader {
    private dictionary = new Map<string, number>();
    private nextFeatureId = 0;

    // Вспомогательная функция для словаря: Строка -> Число
    private getFeatureId(featureStr: string): number {
        if (!this.dictionary.has(featureStr)) {
            this.dictionary.set(featureStr, this.nextFeatureId++);
        }
        return this.dictionary.get(featureStr)!;
    }

    /**
     * Скачивает данные, переводит их в числа и сохраняет батчами в IndexedDB.
     * Возвращает общее количество созданных чанков и сам словарь.
     */
    async downloadAndParse(storage: ClopeStorage, chunkSize: number = 2000): Promise<{ totalChunks: number, dict: Map<string, number> }> {
        const response = await fetch("/data/agaricus-lepiota.data");
        if (!response.ok) throw new Error("Ошибка сети при скачивании");
        
        const content = await response.text();
        const rows = content.split('\n').filter(row => row.trim() !== '');

        let currentChunkId = 0;
        let data: number[] = [];
        let offsets: number[] = [0];

        for (let i = 0; i < rows.length; i++) {
            const elements = rows[i].split(',');
            
            elements.forEach((element, offset) => {
                const char = element.trim().charAt(0);
                if (char && char !== '?') {
                    const featureId = this.getFeatureId(`${offset}:${char}`);
                    data.push(featureId, 1);
                }
            });

            offsets.push(data.length);

            // Если чанк заполнился (или это последняя строка) — сохраняем на диск
            if (offsets.length - 1 === chunkSize || i === rows.length - 1) {
                // offsets.pop() убирает последний элемент, чтобы длина массива offsets 
                // строго равнялась количеству транзакций в чанке. Последний элемент 
                // просто равен data.length, мы его вычислим внутри getTransaction.
                offsets.pop(); 
                
                const chunk = new TransactionChunk(currentChunkId, data, offsets);
                await storage.saveChunk(chunk);
                
                // Очищаем массивы для следующего чанка
                currentChunkId++;
                data = [];
                offsets = [0];
            }
        }

        return { totalChunks: currentChunkId, dict: this.dictionary };
    }
}