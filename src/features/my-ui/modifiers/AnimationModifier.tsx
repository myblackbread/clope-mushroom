import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYAnimation } from "../types/Animation";

export class MYAnimationModifier implements MYViewModifier {
  constructor(private readonly animation: MYAnimation) {}

  transformContext(context?: MYRenderContext): MYRenderContext {
    return { 
        ...context, 
        animation: this.animation 
    };
  }

  body(content: React.ReactNode): React.ReactNode {
    return content;
  }
}