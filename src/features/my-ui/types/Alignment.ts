
import React from "react";

export type MYAlignment =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export const AlignmentMap: Record<
  MYAlignment,
  {
    justifyContent: React.CSSProperties["justifyContent"];
    alignItems: React.CSSProperties["alignItems"];
  }
> = {
  center: { justifyContent: "center", alignItems: "center" },
  top: { justifyContent: "center", alignItems: "flex-start" },
  bottom: { justifyContent: "center", alignItems: "flex-end" },
  left: { justifyContent: "flex-start", alignItems: "center" },
  right: { justifyContent: "flex-end", alignItems: "center" },
  topLeft: { justifyContent: "flex-start", alignItems: "flex-start" },
  topRight: { justifyContent: "flex-end", alignItems: "flex-start" },
  bottomLeft: { justifyContent: "flex-start", alignItems: "flex-end" },
  bottomRight: { justifyContent: "flex-end", alignItems: "flex-end" },
};