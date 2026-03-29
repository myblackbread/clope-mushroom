
import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYForegroundStyle } from "../types/ForegroundStyle";
import { MYContextWrapper } from "../core/ContextWrapper";

export class MYForegroundStyleModifier implements MYViewModifier {
  constructor(private readonly style: MYForegroundStyle) {}

  transformContext(context?: MYRenderContext): MYRenderContext {
    if (context) {
      context.foregroundStyle = this.style;
      return context;
    } else {
      return { foregroundStyle: this.style };
    }
  }
}