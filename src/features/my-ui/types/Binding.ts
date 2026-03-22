
export class MYBinding<T> {
    constructor(
        private readonly getter: () => T,
        private readonly setter: (newValue: T) => void
    ) {}

    get wrappedValue(): T {
        return this.getter();
    }

    set wrappedValue(newValue: T) {
        this.setter(newValue);
    }
}