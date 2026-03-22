import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYFrame } from "../types/Frame";
import { MYRenderContext } from "../types/RenderContext";
import { AlignmentMap } from "../types/Alignment";

export class MYFrameModifier implements MYViewModifier {
  constructor(private readonly value: MYFrame) { }

  body(content: React.ReactNode, context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
    const alignStyles = this.value.alignment ? AlignmentMap[this.value.alignment] : {};

    return (
      <MYBaseView
        renderContext={context}
        frame={{ ...frame, ...this.value }}
        dynamicStyle={{
          style: (prev) => ({
            ...prev,
            ...alignStyles,
            pointerEvents: "none"
          })
        }}
      >
        {content}
      </MYBaseView>
    );
  }

  sizeThatFits(contentFrame: MYFrame): MYFrame {
    return {
      ...contentFrame,
      ...this.value
    };
  }
}