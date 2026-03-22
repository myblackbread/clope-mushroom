import { MushroomClusterEngine } from "./MushroomClusterEngine";
import { TransactionData } from "../core";
import { MainToWorkerMessage, WorkerToMainMessage, WorkerMsgType } from "../models/clope.worker.types";

let engine: MushroomClusterEngine | null = null;

const sendMessage = (msg: WorkerToMainMessage) => self.postMessage(msg);

self.onmessage = (event: MessageEvent<MainToWorkerMessage>) => {
    const data = event.data;

    try {
        switch (data.type) {
            case WorkerMsgType.INIT:
                const transactionsData = data.payload.map(features => new TransactionData(features));
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
    } catch (error: any) {
        sendMessage({ type: WorkerMsgType.ERROR, payload: error.message });
    }
};