
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

    element<Item>(this: MYBinding<Item[]>, index: number): MYBinding<Item> {
        return new MYBinding<Item>(
            () => this.wrappedValue[index],
            (newValue: Item) => {
                const newArray = [...this.wrappedValue];
                newArray[index] = newValue;
                this.wrappedValue = newArray;
            }
        );
    }

    property<K extends keyof T>(key: K): MYBinding<T[K]> {
        return new MYBinding<T[K]>(
            () => this.wrappedValue[key],
            (newValue: T[K]) => {
                this.wrappedValue = { ...this.wrappedValue, [key]: newValue };
            }
        );
    }
}