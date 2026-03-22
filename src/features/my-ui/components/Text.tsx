import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { resolveFont, resolveForegroundStyle } from "../utils/resolveStyles";

export class MYText extends MYView {
  constructor(public readonly text: string) {
    super();
  }

  body(context?: MYRenderContext): React.ReactNode {
    const fontStyles = resolveFont(context?.font, context?.fontWeight);
    const colorStyles = resolveForegroundStyle(context?.foregroundStyle);

    return (
      <MYBaseView
        element="span"
        renderContext={context}
        dynamicStyle={{
          style: (prev) => ({
            ...prev,
            ...fontStyles,
            ...colorStyles,
            whiteSpace: "pre-wrap",
            pointerEvents: "none",
          })
        }}
      >
        {this.text}
      </MYBaseView>
    );
  }
}