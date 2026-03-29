import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYAnimation } from "../types/Animation";

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
}