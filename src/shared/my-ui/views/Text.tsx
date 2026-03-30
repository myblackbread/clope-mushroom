import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "../react-bridge/BaseView";
import { MYFrame } from "../types/Frame";
import { MYRenderContextReact } from "../react-bridge/context/RenderContextReact";
import { resolveFont, resolveForegroundStyle } from "../react-bridge/utils/resolveStyles";

const TextInner: React.FC<{ text: string }> = ({ text }) => {
  const context = React.useContext(MYRenderContextReact);

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

  makeView(frame?: MYFrame): React.ReactNode {
    return <TextInner text={this.text} />;
  }
}