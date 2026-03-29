import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYColorType } from "../types/ColorType";
import { MYBaseView } from "../components/BaseView";
import { MYFrame } from "../types/Frame";
import { MYAnyView, MYView } from "../core/View";

export class MYShapeFillModifier implements MYViewModifier {
  constructor(private readonly color: MYColorType) { }

  body(content: MYView): MYView {
    const colorValue = typeof this.color === "string"
      ? this.color
      : this.color.rawValue;

    return new MYAnyView((parentFrame) => {
      const mergedFrame = { ...content.idealFrame, ...parentFrame };

      return (
        <MYBaseView
          frame={mergedFrame}
          dynamicStyle={{
            style: (prev) => ({
              ...prev,
              color: colorValue,
              width: "100%",
              height: "100%"
            })
          }}
        >
          {content.makeView(parentFrame)}
        </MYBaseView>
      );
    });
  }
}