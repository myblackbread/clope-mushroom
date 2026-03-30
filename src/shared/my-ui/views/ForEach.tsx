import { MYView } from "../core/View";
import { MYID } from "../types/ID";
import { MYIdentifiable } from "../types/Identifiable";
import { MYBinding } from "../state/Binding";
import { MYAnyViewChild } from "../types/AnyViewChild"; // Импортируем наш тип!

// ==========================================
// ПЕРЕГРУЗКИ ДЛЯ ОБЫЧНЫХ МАССИВОВ
// ==========================================
export function MYForEach<Data extends MYIdentifiable>(
    data: Data[],
    content: (item: Data) => MYAnyViewChild | MYAnyViewChild[]
): MYView[];

export function MYForEach<Data, Key extends keyof Data>(
    data: Data[],
    id: Key,
    content: (item: Data) => MYAnyViewChild | MYAnyViewChild[]
): MYView[];

export function MYForEach<Data>(
    data: Data[],
    id: (item: Data) => MYID,
    content: (item: Data) => MYAnyViewChild | MYAnyViewChild[]
): MYView[];

// ==========================================
// ПЕРЕГРУЗКИ ДЛЯ БИНДИНГОВ
// ==========================================
export function MYForEach<Data extends MYIdentifiable>(
    data: MYBinding<Data[]>,
    content: (item: MYBinding<Data>) => MYAnyViewChild | MYAnyViewChild[]
): MYView[];

export function MYForEach<Data, Key extends keyof Data>(
    data: MYBinding<Data[]>,
    id: Key,
    content: (item: MYBinding<Data>) => MYAnyViewChild | MYAnyViewChild[]
): MYView[];

export function MYForEach<Data>(
    data: MYBinding<Data[]>,
    id: (item: Data) => MYID,
    content: (item: MYBinding<Data>) => MYAnyViewChild | MYAnyViewChild[]
): MYView[];

// ==========================================
// СКРЫТАЯ РЕАЛИЗАЦИЯ
// ==========================================
export function MYForEach<Data>(...args: unknown[]): MYView[] {
    const firstArg = args[0];
    const isBinding = firstArg instanceof MYBinding;

    const dataArray = isBinding
        ? (firstArg as MYBinding<Data[]>).wrappedValue
        : (firstArg as Data[]);

    const applyIds = (result: MYAnyViewChild | MYAnyViewChild[], baseId: MYID): MYView[] => {
        if (!result || typeof result === "boolean") return [];

        if (Array.isArray(result)) {
            return result
                .filter((view): view is MYView => view instanceof MYView)
                .map((view, i) => view.id(`${baseId}_${i}`));
        }
        
        if (result instanceof MYView) {
            return [result.id(baseId)];
        }

        return [];
    };

    if (args.length === 2) {
        const content = args[1] as Function;
        
        return dataArray.flatMap((item, index) => {
            const viewId = (item as unknown as MYIdentifiable).id;
            
            const viewContent = isBinding 
                ? content((firstArg as MYBinding<Data[]>).element(index)) 
                : content(item);
                
            return applyIds(viewContent, viewId);
        });
    }

    if (args.length === 3) {
        const idExtractor = args[1];
        const content = args[2] as Function;

        return dataArray.flatMap((item, index) => {
            const viewId: MYID = typeof idExtractor === "function"
                ? (idExtractor as (item: Data) => MYID)(item)
                : (item[idExtractor as keyof Data] as unknown as MYID);

            const viewContent = isBinding 
                ? content((firstArg as MYBinding<Data[]>).element(index)) 
                : content(item);
            
            return applyIds(viewContent, viewId);
        });
    }

    return [];
}