import { MYColorType } from "./ColorType";

export type MYHierarchicalStyle = "primary" | "secondary" | "tertiary" | "quaternary";

export type MYForegroundStyle = MYColorType | MYHierarchicalStyle;