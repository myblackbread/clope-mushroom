import { MYComponentProps } from "./ComponentProps";

type MYPropUpdater<T> = (prev: T) => T;

export type MYDynamicStyle<K extends keyof HTMLElementTagNameMap> = {
  [P in keyof MYComponentProps<K>]?: MYPropUpdater<MYComponentProps<K>[P]>;
};
