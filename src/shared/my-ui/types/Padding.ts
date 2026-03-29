import { MYEdgeInsets } from "./EdgeInsets";
import { MYEdge } from "./Edge";

export type MYPadding =
    | number
    | MYEdgeInsets
    | { edges?: MYEdge | MYEdge[]; length: number };