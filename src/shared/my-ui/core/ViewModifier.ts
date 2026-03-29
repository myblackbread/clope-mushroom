import React from "react";
import { MYFrame } from "../types/Frame";
import { MYRenderContext } from "../types/RenderContext";
import { MYView } from "./View";

export interface MYViewModifier {
  body?(content: MYView): MYView;

  sizeThatFits?(contentFrame: MYFrame): MYFrame;

  transformContext?(context?: MYRenderContext): MYRenderContext;
}