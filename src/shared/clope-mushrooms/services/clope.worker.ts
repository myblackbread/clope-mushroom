import { MushroomClusterEngine } from "./MushroomClusterEngine";
import { TransactionData } from "../core";
import { MainToWorkerMessage, WorkerToMainMessage, WorkerMsgType } from "../models/clope.worker.types";
import { MushroomDataLoader } from "./MushroomDataLoader";

let engine: MushroomClusterEngine | null = null;

const sendMessage = (msg: WorkerToMainMessage) => self.postMessage(msg);

self.onmessage = async (event: MessageEvent<MainToWorkerMessage>) => {
    const data = event.data;

    try {
        switch (data.type) {
            case WorkerMsgType.INIT:
                const loader = new MushroomDataLoader();
                const rawTransactions = await loader.fetchTransactions();

                const transactionsData = rawTransactions.map(features => new TransactionData(features));
                engine = new MushroomClusterEngine(transactionsData);

                sendMessage({ type: WorkerMsgType.INIT_DONE });
                break;

            case WorkerMsgType.RUN_PHASE_ONE:
                if (!engine) throw new Error("Движок не инициализирован");
                const resultOne = engine.runPhaseOne(data.payload.repulsion);
                sendMessage({ type: WorkerMsgType.PHASE_ONE_DONE, payload: resultOne });
                break;

            case WorkerMsgType.RUN_PHASE_TWO:
                if (!engine) throw new Error("Движок не инициализирован");
                const resultTwo = engine.runPhaseTwo();
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