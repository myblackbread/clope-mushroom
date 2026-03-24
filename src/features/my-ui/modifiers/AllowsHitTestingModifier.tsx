import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";

export class MYAllowsHitTestingModifier implements MYViewModifier {
  constructor(private readonly enabled: boolean) { }

  transformContext(context?: MYRenderContext): MYRenderContext {
    if (context) {
      const parentAllows = context?.allowsHitTesting ?? true;
      context.allowsHitTesting = parentAllows ? this.enabled : false;
      return context;
    } else {
      return { allowsHitTesting: this.enabled };
    }
  }
}