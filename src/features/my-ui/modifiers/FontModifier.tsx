
import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYFont, MYFontWeight } from "../types/Font";

export class MYFontModifier implements MYViewModifier {
  constructor(private readonly font: MYFont) {}

  transformContext(context?: MYRenderContext): MYRenderContext {
    return { ...context, font: this.font };
  }

  body(content: React.ReactNode): React.ReactNode {
    return content;
  }
}

export class MYFontWeightModifier implements MYViewModifier {
  constructor(private readonly weight: MYFontWeight) {}

  transformContext(context?: MYRenderContext): MYRenderContext {
    return { ...context, fontWeight: this.weight };
  }

  body(content: React.ReactNode): React.ReactNode {
    return content;
  }
}