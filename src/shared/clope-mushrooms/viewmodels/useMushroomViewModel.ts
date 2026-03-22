import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { MYBinding } from "@/src/features/my-ui";
import { MushroomDataLoader } from "../services/MushroomDataLoader";
import { ClusterInfo } from "../models/ClusterInfo";
import { WorkerMsgType, WorkerToMainMessage, MainToWorkerMessage } from "../models/clope.worker.types";

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
        workerRef.current = new Worker(new URL('../services/clope.worker.ts', import.meta.url));

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
                case WorkerMsgType.ERROR:
                    setErrorMessage(`Ошибка Worker: ${data.payload}`);
                    setIsFetching(false);
                    setIsCalculating(false);
            }
        };

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
        () => new MYBinding(() => repulsion, setRepulsion),
        [repulsion, setRepulsion]
    );

    const loadData = async () => {
        setIsFetching(true);
        setErrorMessage(null);
        try {
            const loader = new MushroomDataLoader();
            const rawTransactions = await loader.fetchTransactions();

            workerRef.current?.postMessage({ type: "INIT", payload: rawTransactions });
            resetClusteringState();
        } catch (error: any) {
            setErrorMessage(`Ошибка сети: ${error.message}`);
            setIsFetching(false);
        }
    };

    const runPhaseOne = () => {
        setErrorMessage(null);
        setIsCalculating(true);

        workerRef.current?.postMessage({
            type: WorkerMsgType.RUN_PHASE_ONE,
            payload: { repulsion }
        });
    };

    const runPhaseTwo = () => {
        if (!isPhaseOneCompleted) return;
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