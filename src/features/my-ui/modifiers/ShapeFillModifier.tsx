import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYColorType } from "../types/ColorType";
import { MYBaseView } from "../components/BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYFrame } from "../types/Frame";

export class MYShapeFillModifier implements MYViewModifier {
  constructor(private readonly color: MYColorType) { }

  body(content: React.ReactNode, context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
    const colorValue = typeof this.color === "string"
      ? this.color
      : this.color.rawValue;

    return (
      <MYBaseView
        frame={frame}
        renderContext={context}
        dynamicStyle={{
          style: (prev) => ({
            ...prev,
            color: colorValue,
            width: "100%",
            height: "100%"
          })
        }}
      >
        {content}
      </MYBaseView>
    );
  }
}