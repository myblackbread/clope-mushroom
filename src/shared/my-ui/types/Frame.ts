import { MYAlignment } from "./Alignment";

export type MYFrame = {
  alignment?: MYAlignment;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
};

export function isFlexible(val?: number | string): boolean {
  if (val === undefined) return false;
  if (val === Infinity) return true;
  if (typeof val === "string") {
    return val.trim().endsWith("%") || val.trim() === "auto";
  }
  return false;
}