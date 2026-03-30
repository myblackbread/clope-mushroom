import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "../react-bridge/BaseView";
import { MYFrame } from "../types/Frame";
import { MYAxis } from "../types/Axis";

export class MYScrollView extends MYView {

    constructor(
        private readonly content: MYView,
        private readonly axis: MYAxis | MYAxis[] = "vertical"
    ) {
        super();
    }

    private get isHorizontal(): boolean {
        return this.axis === "horizontal" || (Array.isArray(this.axis) && this.axis.includes("horizontal"))
    }

    private get isVertical(): boolean {
        return this.axis === "vertical" || (Array.isArray(this.axis) && this.axis.includes("vertical"));
    }

    makeView(frame?: MYFrame): React.ReactNode {
        return (
            <MYBaseView
                frame={frame}
                dynamicStyle={{
                    style: (prev) => ({
                        ...prev,
                        overflowX: this.isHorizontal ? "scroll" : "hidden",
                        overflowY: this.isVertical ? "scroll" : "hidden",
                        width: this.isHorizontal ? "100%" : prev?.width,
                        height: this.isVertical ? "100%" : prev?.height,
                        maxWidth: "100%",
                        maxHeight: "100%",
                        display: "grid",
                        placeItems: "start",
                        // justifyContent: "center",
                        // alignItems: "center"
                    })
                }}
            >
                <div style={{
                    minWidth: this.isHorizontal ? "max-content" : "100%",
                    minHeight: this.isVertical ? "max-content" : "100%",
                }}>
                    {this.content.makeView()}
                </div>
            </MYBaseView>
        );
    }

    get idealFrame(): MYFrame {
        return {
            maxWidth: this.isHorizontal ? Infinity : undefined,
            maxHeight: this.isVertical ? Infinity : undefined
        };
    }
}