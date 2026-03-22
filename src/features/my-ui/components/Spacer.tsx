import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYFrame } from "../types/Frame";

export class MYSpacer extends MYView {
  constructor(private readonly minLength?: number) {
    super();
  }

  body(context?: MYRenderContext): React.ReactNode {
    return (
      <MYBaseView
        renderContext={context}
        dynamicStyle={{
          style: (prev) => ({
            ...prev,
            width: "auto",
            height: "auto",
            flexGrow: 1,
            flexShrink: 0,
            flexBasis: this.minLength ?? 0,
            pointerEvents: "none",
            alignSelf: "stretch"
          })
        }}
      />
    );
  }

  get isSpacer(): boolean {
    return true;
  }
}