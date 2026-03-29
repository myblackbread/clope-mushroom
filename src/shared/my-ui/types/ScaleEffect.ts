import { MYSize } from "./Size";
import { MYUnitPoint } from "./UnitPoint";

export type MYScaleEffect =
    | number
    | { s: number; anchor?: MYUnitPoint }
    | { scale: MYSize; anchor?: MYUnitPoint }
    | { x?: number; y?: number; anchor?: MYUnitPoint };
