
import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYForegroundStyle } from "../types/ForegroundStyle";

export class MYForegroundStyleModifier implements MYViewModifier {
  constructor(private readonly style: MYForegroundStyle) {}

  transformContext(context?: MYRenderContext): MYRenderContext {
    return { ...context, foregroundStyle: this.style };
  }

  body(content: React.ReactNode): React.ReactNode {
    return content;
  }
}