import MY from "@/src/shared/my-ui";
import { WorkerMsgType } from "../worker/clope.worker.types";
import { ClusterInfo } from "../../../entities/clope/model/ClusterInfo";

export class MushroomViewModel {
    public readonly repulsion = new MY.State<number>(2.0);
    public readonly isFetching = new MY.State(false);
    public readonly isCalculating = new MY.State(false);
    public readonly errorMessage = new MY.State<string | null>(null);
    public readonly isDataLoaded = new MY.State(false);
    public readonly isPhaseOneCompleted = new MY.State(false);
    public readonly clustersInfo = new MY.State<ClusterInfo[]>([]);
    public readonly currentProfit = new MY.State<number | null>(null);

    private worker: Worker | null = null;

    constructor() {
        this.initWorker();
        
        // Подписываемся на изменение repulsion, чтобы сбрасывать стейт
        // Можно реализовать через onChange внутри view, но логичнее в модели
    }

    private initWorker() {
        try {
            this.worker = new Worker(
                new URL('../worker/clope.worker.ts', import.meta.url),
                { type: 'module' }
            );

            this.worker.onerror = (errorEvent) => {
                this.errorMessage.wrappedValue = `Критическая ошибка Worker'а: ${errorEvent.message}`;
                this.isFetching.wrappedValue = false;
                this.isCalculating.wrappedValue = false;
            };

            this.worker.onmessage = (event) => {
                const data = event.data;
                switch (data.type) {
                    case WorkerMsgType.INIT_DONE:
                        this.isDataLoaded.wrappedValue = true;
                        this.isFetching.wrappedValue = false;
                        break;
                    case WorkerMsgType.PHASE_ONE_DONE:
                        this.currentProfit.wrappedValue = data.payload.profit;
                        this.clustersInfo.wrappedValue = data.payload.clusters;
                        this.isPhaseOneCompleted.wrappedValue = true;
                        this.isCalculating.wrappedValue = false;
                        break;
                    case WorkerMsgType.PHASE_TWO_DONE:
                        if (data.payload) {
                            this.currentProfit.wrappedValue = data.payload.profit;
                            this.clustersInfo.wrappedValue = data.payload.clusters;
                        }
                        this.isCalculating.wrappedValue = false;
                        break;
                    case WorkerMsgType.ERROR:
                        this.errorMessage.wrappedValue = `Ошибка Worker: ${data.payload}`;
                        this.isFetching.wrappedValue = false;
                        this.isCalculating.wrappedValue = false;
                }
            };
        } catch (error: any) {
            this.errorMessage.wrappedValue = "Не удалось запустить фоновый процесс.";
        }
    }

    public resetClusteringState() {
        this.clustersInfo.wrappedValue = [];
        this.currentProfit.wrappedValue = null;
        this.isPhaseOneCompleted.wrappedValue = false;
    }

    public loadData() {
        if (this.isFetching.wrappedValue || this.isCalculating.wrappedValue) return;
        this.isFetching.wrappedValue = true;
        this.errorMessage.wrappedValue = null;
        this.resetClusteringState();
        this.worker?.postMessage({ type: WorkerMsgType.INIT });
    }

    public runPhaseOne() {
        if (this.isCalculating.wrappedValue || this.isFetching.wrappedValue) return;
        this.errorMessage.wrappedValue = null;
        this.isCalculating.wrappedValue = true;
        this.worker?.postMessage({
            type: WorkerMsgType.RUN_PHASE_ONE,
            payload: { repulsion: this.repulsion.wrappedValue }
        });
    }

    public runPhaseTwo() {
        if (!this.isPhaseOneCompleted.wrappedValue || this.isCalculating.wrappedValue || this.isFetching.wrappedValue) return;
        this.isCalculating.wrappedValue = true;
        this.worker?.postMessage({ type: WorkerMsgType.RUN_PHASE_TWO });
    }

    public dispose() {
        this.worker?.terminate();
    }
}