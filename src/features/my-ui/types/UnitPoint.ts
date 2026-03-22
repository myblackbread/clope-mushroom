
export type MYUnitPoint =
  | "zero"
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export const unitPointMap: Record<MYUnitPoint, React.CSSProperties["transformOrigin"]> = {
  zero: "left top",
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
  topLeft: "left top",
  topRight: "right top",
  bottomLeft: "left bottom",
  bottomRight: "right bottom",
};