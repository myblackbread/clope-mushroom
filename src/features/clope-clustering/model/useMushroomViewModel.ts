import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import MY from "@/src/shared/my-ui";
import { ClusterInfo } from "../../../entities/clope/model/ClusterInfo";
import { WorkerMsgType } from "../worker/clope.worker.types";

export function useMushroomViewModel() {
    const [repulsion, setRepulsionInternal] = useState<number>(2.0);
    const [isFetching, setIsFetching] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isPhaseOneCompleted, setIsPhaseOneCompleted] = useState(false);
    const [clustersInfo, setClustersInfo] = useState<ClusterInfo[]>([]);
    const [currentProfit, setCurrentProfit] = useState<number | null>(null);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        try {
            workerRef.current = new Worker(
                new URL('../worker/clope.worker.ts', import.meta.url),
                { type: 'module' }
            );

            workerRef.current.onerror = (errorEvent) => {
                setErrorMessage(`Критическая ошибка Worker'а: ${errorEvent.message}`);
                setIsFetching(false);
                setIsCalculating(false);
            };

            workerRef.current.onmessage = (event) => {
                const data = event.data;

                switch (data.type) {
                    case WorkerMsgType.INIT_DONE:
                        setIsDataLoaded(true);
                        setIsFetching(false);
                        break;
                    case WorkerMsgType.PHASE_ONE_DONE:
                        setCurrentProfit(data.payload.profit);
                        setClustersInfo(data.payload.clusters);
                        setIsPhaseOneCompleted(true);
                        setIsCalculating(false);
                        break;
                    case WorkerMsgType.PHASE_TWO_DONE:
                        if (data.payload) {
                            setCurrentProfit(data.payload.profit);
                            setClustersInfo(data.payload.clusters);
                        }
                        setIsCalculating(false);
                        break;
                    case WorkerMsgType.ERROR:
                        setErrorMessage(`Ошибка Worker: ${data.payload}`);
                        setIsFetching(false);
                        setIsCalculating(false);
                }
            };

        } catch (error: any) {
            setErrorMessage("Не удалось запустить фоновый процесс. Проверьте настройки браузера.");
        }

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const resetClusteringState = useCallback(() => {
        setClustersInfo([]);
        setCurrentProfit(null);
        setIsPhaseOneCompleted(false);
    }, []);

    const setRepulsion = useCallback((newValue: number) => {
        setRepulsionInternal(newValue);
        resetClusteringState();
    }, [resetClusteringState]);

    const repulsionBinding = useMemo(
        () => new MY.Binding(() => repulsion, setRepulsion),
        [repulsion, setRepulsion]
    );

    const loadData = () => {
        if (isFetching || isCalculating) return;

        if (!workerRef.current) {
            setErrorMessage("Фоновый процесс не инициализирован. Перезагрузите страницу.");
            return;
        }

        setIsFetching(true);
        setErrorMessage(null);
        resetClusteringState();

        workerRef.current?.postMessage({ type: WorkerMsgType.INIT });
    };

    const runPhaseOne = () => {
        if (isCalculating || isFetching) return;

        if (!workerRef.current) {
            setErrorMessage("Фоновый процесс не инициализирован.");
            return;
        }

        setErrorMessage(null);
        setIsCalculating(true);

        workerRef.current?.postMessage({
            type: WorkerMsgType.RUN_PHASE_ONE,
            payload: { repulsion }
        });
    };

    const runPhaseTwo = () => {
        if (!isPhaseOneCompleted || isCalculating || isFetching) return;

        if (!workerRef.current) {
            setErrorMessage("Фоновый процесс не инициализирован.");
            return;
        }

        setIsCalculating(true);
        workerRef.current?.postMessage({ type: WorkerMsgType.RUN_PHASE_TWO });
    };

    return {
        repulsion: repulsionBinding,
        isFetching,
        isCalculating,
        errorMessage,
        isDataLoaded,
        isPhaseOneCompleted,
        clustersInfo,
        currentProfit,
        loadData,
        runPhaseOne,
        runPhaseTwo,
    };
}