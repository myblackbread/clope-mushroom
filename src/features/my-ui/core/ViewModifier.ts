import React from "react";
import { MYFrame } from "../types/Frame";
import { MYRenderContext } from "../types/RenderContext";

export interface MYViewModifier {
  body(content: React.ReactNode, frame?: MYFrame): React.ReactNode;

  sizeThatFits?(contentFrame: MYFrame): MYFrame;

  transformContext?(context?: MYRenderContext): MYRenderContext;
}