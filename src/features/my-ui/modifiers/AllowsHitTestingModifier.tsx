import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYFrame } from "../types/Frame";

export class MYAllowsHitTestingModifier implements MYViewModifier {
  constructor(private readonly enabled: boolean) { }

  transformContext(context?: MYRenderContext): MYRenderContext {
    const parentAllows = context?.allowsHitTesting ?? true;

    return {
      ...context,
      allowsHitTesting: parentAllows ? this.enabled : false,
    };
  }

  body(content: React.ReactNode, context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
    return content;
  }
}