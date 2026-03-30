import { MYDependencyTracker, MYStateObserver } from "./ReactiveSystem";
import { MYBinding } from "./Binding";

export class MYState<T> {
    private _value: T;
    private observers = new Set<MYStateObserver>();

    constructor(initialValue: T) {
        this._value = initialValue;
    }

    get wrappedValue(): T {
        if (MYDependencyTracker.currentObserver) {
            MYDependencyTracker.currentObserver.addDependency(this);
        }
        return this._value;
    }

    set wrappedValue(newValue: T) {
        if (this._value !== newValue) {
            this._value = newValue;
            const currentObservers = Array.from(this.observers);
            currentObservers.forEach(obs => obs.trigger());
        }
    }

    subscribe(observer: MYStateObserver) {
        this.observers.add(observer);
    }

    unsubscribe(observer: MYStateObserver) {
        this.observers.delete(observer);
    }

    get projectedValue(): MYBinding<T> {
        return new MYBinding<T>(
            () => this.wrappedValue,
            newValue => this.wrappedValue = newValue
        );
    }
}