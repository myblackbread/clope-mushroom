import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";

export class MYDisabledModifier implements MYViewModifier {
  constructor(private readonly isDisabled: boolean) {}

  transformContext(context?: MYRenderContext): MYRenderContext {
    const parentDisabled = context?.disabled ?? false;
    return { 
        ...context, 
        disabled: parentDisabled || this.isDisabled 
    };
  }

  body(content: React.ReactNode): React.ReactNode {
    return content;
  }
}