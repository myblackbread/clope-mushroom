
import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYContextWrapper } from "../core/ContextWrapper";
import { MYFontWeight } from "../types/Font";

export class MYFontWeightModifier implements MYViewModifier {
  constructor(private readonly weight: MYFontWeight) { }

  transformContext(context?: MYRenderContext): MYRenderContext {
    if (context) {
      context.fontWeight = this.weight;
      return context;
    } else {
      return { fontWeight: this.weight };
    }
  }
}