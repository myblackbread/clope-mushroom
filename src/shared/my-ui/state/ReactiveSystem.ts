import { MYState } from "./State";

export class MYDependencyTracker {
    static currentObserver: MYStateObserver | null = null;
}

export class MYStateObserver {
    private dependencies = new Set<MYState<any>>();

    constructor(private readonly triggerRender: () => void) { }

    track<T>(action: () => T): T {
        this.cleanup();

        MYDependencyTracker.currentObserver = this;
        const result = action();
        MYDependencyTracker.currentObserver = null;

        return result;
    }

    addDependency(state: MYState<any>) {
        this.dependencies.add(state);
        state.subscribe(this);
    }

    trigger() {
        this.triggerRender();
    }

    cleanup() {
        this.dependencies.forEach(dep => dep.unsubscribe(this));
        this.dependencies.clear();
    }
}