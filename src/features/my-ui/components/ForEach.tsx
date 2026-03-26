
import { MYView } from "../core/View";
import { MYID } from "../types/ID";
import { MYIdentifiable } from "../types/Identifiable";
import { MYBinding } from "../types/Binding";

// ==========================================
// ПЕРЕГРУЗКИ ДЛЯ ОБЫЧНЫХ МАССИВОВ
// ==========================================
export function MYForEach<Data extends MYIdentifiable>(
    data: Data[],
    content: (item: Data) => MYView
): MYView[];

export function MYForEach<Data, Key extends keyof Data>(
    data: Data[],
    id: Key,
    content: (item: Data) => MYView
): MYView[];

export function MYForEach<Data>(
    data: Data[],
    id: (item: Data) => MYID,
    content: (item: Data) => MYView
): MYView[];

// ==========================================
// ПЕРЕГРУЗКИ ДЛЯ БИНДИНГОВ
// ==========================================
export function MYForEach<Data extends MYIdentifiable>(
    data: MYBinding<Data[]>,
    content: (item: MYBinding<Data>) => MYView
): MYView[];

export function MYForEach<Data, Key extends keyof Data>(
    data: MYBinding<Data[]>,
    id: Key,
    content: (item: MYBinding<Data>) => MYView
): MYView[];

export function MYForEach<Data>(
    data: MYBinding<Data[]>,
    id: (item: Data) => MYID,
    content: (item: MYBinding<Data>) => MYView
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

    // Обработка: data, content
    if (args.length === 2) {
        if (isBinding) {
            const arrayBinding = firstArg as MYBinding<Data[]>;
            const content = args[1] as (item: MYBinding<Data>) => MYView;
            
            return dataArray.map((item, index) => {
                const view = content(arrayBinding.element(index));
                const viewId = (item as unknown as MYIdentifiable).id;
                return view.id(viewId);
            });
        } else {
            const content = args[1] as (item: Data) => MYView;
            return dataArray.map((item) => {
                const view = content(item);
                const viewId = (item as unknown as MYIdentifiable).id;
                return view.id(viewId);
            });
        }
    }

    if (args.length === 3) {
        const idExtractor = args[1];

        if (isBinding) {
            const arrayBinding = firstArg as MYBinding<Data[]>;
            const content = args[2] as (item: MYBinding<Data>) => MYView;

            return dataArray.map((item, index) => {
                const view = content(arrayBinding.element(index));
                
                let viewId: MYID;
                if (typeof idExtractor === "function") {
                    viewId = idExtractor(item) as MYID;
                } else {
                    viewId = (item as Record<keyof Data, unknown>)[idExtractor as keyof Data] as MYID;
                }
                
                return view.id(viewId);
            });
        } else {
            const content = args[2] as (item: Data) => MYView;

            return dataArray.map((item) => {
                const view = content(item);
                
                let viewId: MYID;
                if (typeof idExtractor === "function") {
                    viewId = idExtractor(item) as MYID;
                } else {
                    viewId = (item as Record<keyof Data, unknown>)[idExtractor as keyof Data] as MYID;
                }
                    
                return view.id(viewId);
            });
        }
    }

    return [];
}