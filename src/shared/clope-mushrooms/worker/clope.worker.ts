import { MushroomClusterEngine } from "../core/MushroomClusterEngine";
import { ClopeStorage } from "../storage/ClopeStorage";
import { MushroomDataLoader } from "../parser/MushroomDataLoader";
import { MainToWorkerMessage, WorkerToMainMessage, WorkerMsgType } from "./clope.worker.types";

let engine: MushroomClusterEngine | null = null;
let storage: ClopeStorage | null = null;

// Состояние после INIT
let totalChunksCount = 0;
let edibleFeatureId = -1;
let poisonousFeatureId = -1;

const sendMessage = (msg: WorkerToMainMessage) => self.postMessage(msg);

self.onmessage = async (event: MessageEvent<MainToWorkerMessage>) => {
    const data = event.data;

    try {
        switch (data.type) {
            case WorkerMsgType.INIT:
                // 1. Инициализируем и очищаем жесткий диск
                storage = new ClopeStorage();
                await storage.init();
                await storage.clear();

                // 2. Скачиваем, парсим и разбиваем на чанки
                const loader = new MushroomDataLoader();
                const result = await loader.downloadAndParse(storage, 2000);
                
                totalChunksCount = result.totalChunks;
                
                // 3. Достаем ID нужных признаков для финальной статистики
                edibleFeatureId = result.dict.get("0:e") ?? -1;
                poisonousFeatureId = result.dict.get("0:p") ?? -1;

                sendMessage({ type: WorkerMsgType.INIT_DONE });
                break;

            case WorkerMsgType.RUN_PHASE_ONE:
                if (!storage || totalChunksCount === 0) throw new Error("Данные не инициализированы");
                
                // Создаем движок
                engine = new MushroomClusterEngine(storage, totalChunksCount, data.payload.repulsion);
                
                await engine.runPhaseOne();
                
                // Собираем результаты
                const resultOne = engine.getResults(edibleFeatureId, poisonousFeatureId);
                sendMessage({ type: WorkerMsgType.PHASE_ONE_DONE, payload: resultOne });
                break;

            case WorkerMsgType.RUN_PHASE_TWO:
                if (!engine) throw new Error("Движок не инициализирован");
                
                await engine.runPhaseTwo();
                
                const resultTwo = engine.getResults(edibleFeatureId, poisonousFeatureId);
                sendMessage({ type: WorkerMsgType.PHASE_TWO_DONE, payload: resultTwo });
                break;
        }
    } catch (error: unknown) {
        let errorMessage = "Неизвестная ошибка";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }
        sendMessage({ type: WorkerMsgType.ERROR, payload: errorMessage });
    }
};