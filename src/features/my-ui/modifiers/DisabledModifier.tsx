import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYRenderContext } from "../types/RenderContext";
import { MYContextWrapper } from "../core/ContextWrapper";

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

  body(content: React.ReactNode): React.ReactNode {
    return (
      <MYContextWrapper transform={(context) => this.transformContext(context)}>
        {content}
      </MYContextWrapper>
    );
  }
}