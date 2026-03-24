import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";

export class MYDisabledModifier implements MYViewModifier {
  constructor(private readonly isDisabled: boolean) { }

  transformContext(context?: MYRenderContext): MYRenderContext {
    if (context) {
      const parentDisabled = context?.disabled ?? false;
      context.disabled = parentDisabled || this.isDisabled;
      return context;
    } else {
      return { disabled: this.isDisabled };
    }
  }
}