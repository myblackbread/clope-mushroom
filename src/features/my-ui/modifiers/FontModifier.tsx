
import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYContextWrapper } from "../core/ContextWrapper";
import { MYFont } from "../types/Font";

export class MYFontModifier implements MYViewModifier {
  constructor(private readonly font: MYFont) { }

  transformContext(context?: MYRenderContext): MYRenderContext {
    if (context) {
      context.font = this.font;
      return context;
    } else {
      return { font: this.font };
    }
  }
}