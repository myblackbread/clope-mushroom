import { ClusterInfo } from "../models/ClusterInfo";

export enum WorkerMsgType {
    INIT = "INIT",
    RUN_PHASE_ONE = "RUN_PHASE_ONE",
    RUN_PHASE_TWO = "RUN_PHASE_TWO",

    INIT_DONE = "INIT_DONE",
    PHASE_ONE_DONE = "PHASE_ONE_DONE",
    PHASE_TWO_DONE = "PHASE_TWO_DONE",
    ERROR = "ERROR",
}

export type MainToWorkerMessage =
    | { type: WorkerMsgType.INIT }
    | { type: WorkerMsgType.RUN_PHASE_ONE; payload: { repulsion: number } }
    | { type: WorkerMsgType.RUN_PHASE_TWO };

export type WorkerToMainMessage =
    | { type: WorkerMsgType.INIT_DONE }
    | { type: WorkerMsgType.PHASE_ONE_DONE; payload: { profit: number; clusters: ClusterInfo[] } }
    | { type: WorkerMsgType.PHASE_TWO_DONE; payload: { profit: number; clusters: ClusterInfo[] } | null }
    | { type: WorkerMsgType.ERROR; payload: string };