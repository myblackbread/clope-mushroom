import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { useMYRenderContext } from "../context/RenderContextReact";
import { resolveFont, resolveForegroundStyle } from "../utils/resolveStyles";
import { MYFrame } from "../types/Frame";

const TextInner: React.FC<{ text: string }> = ({ text }) => {
  const context = useMYRenderContext();

  const fontStyles = resolveFont(context?.font, context?.fontWeight);
  const colorStyles = resolveForegroundStyle(context?.foregroundStyle);

  return (
    <MYBaseView
      element="span"
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
      {text}
    </MYBaseView>
  );
};

export class MYText extends MYView {
  constructor(public readonly text: string) {
    super();
  }

  body(frame?: MYFrame): React.ReactNode {
    return <TextInner text={this.text} />;
  }
}