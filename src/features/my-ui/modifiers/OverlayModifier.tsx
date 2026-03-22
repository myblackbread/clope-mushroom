import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYView, MYAnyView } from "../core/View";
import { MYBackgroundType } from "./BackgroundModifier";
import { MYBaseView } from "../components/BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYFrame } from "../types/Frame";
import { MYOverlayType } from "../types/OverlayType";

export class MYOverlayModifier implements MYViewModifier {
  constructor(private readonly overlay: MYOverlayType) { }

  private renderOverlay(context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
    if (typeof this.overlay === "string") {
      return <div style={{ width: "100%", height: "100%", background: this.overlay }} />;
    }
    if (this.overlay instanceof MYView) {
      return this.overlay.body(context);
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

  body(content: React.ReactNode, context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
    return (
      <MYBaseView
        frame={frame}
        renderContext={context}
      >
        {content}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          pointerEvents: "none",
        }}>
          {new MYAnyView(this.renderOverlay())
            .frame({ maxWidth: Infinity, maxHeight: Infinity })
            .body(context, frame)}
        </div>
      </MYBaseView>
    );
  }
}