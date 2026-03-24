import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYAnimation } from "../types/Animation";
import { MYContextWrapper } from "../core/ContextWrapper";

export class MYAnimationModifier implements MYViewModifier {
  constructor(private readonly animation: MYAnimation) {}

  transformContext(context?: MYRenderContext): MYRenderContext {
    if (context) {
      context.animation = this.animation;
      return context;
    } else {
      return { animation: this.animation };
    }
  }

  body(content: React.ReactNode): React.ReactNode {
    return (
      <MYContextWrapper transform={(context) => this.transformContext(context)}>
        {content}
      </MYContextWrapper>
    );
  }
}