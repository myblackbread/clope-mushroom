import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYView, MYAnyView } from "../core/View";
import { MYBaseView } from "../components/BaseView";
import { MYFrame } from "../types/Frame";
import { MYOverlayType } from "../types/OverlayType";

export class MYOverlayModifier implements MYViewModifier {
  constructor(private readonly overlay: MYOverlayType) { }

  private renderOverlay(frame?: MYFrame): React.ReactNode {
    if (typeof this.overlay === "string") {
      return <div style={{ width: "100%", height: "100%", background: this.overlay }} />;
    }

    if (this.overlay instanceof MYView) {
      return this.overlay.makeView(frame);
    }

    const { url, repeat, position, size } = this.overlay;
    return (
      <div style={{
        width: "100%", height: "100%",
        backgroundImage: `url(${url})`, backgroundRepeat: repeat,
        backgroundPosition: position, backgroundSize: size,
      }} />
    );
  }


  body(content: MYView): MYView {
    return new MYAnyView((parentFrame) => {
      const mergedFrame = { ...content.idealFrame, ...parentFrame };

      return (
        <MYBaseView frame={mergedFrame}>
          {content.makeView(parentFrame)}

          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            pointerEvents: "none",
          }}>
            {new MYAnyView(this.renderOverlay(parentFrame))
              .frame({ maxWidth: Infinity, maxHeight: Infinity })
              .makeView(parentFrame)}
          </div>
        </MYBaseView>
      )
    });
  }
}