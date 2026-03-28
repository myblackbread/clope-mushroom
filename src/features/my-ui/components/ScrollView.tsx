import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYFrame } from "../types/Frame";
import { MYAxis } from "../types/Axis";

export class MYScrollView extends MYView {
    constructor(
        private readonly content: MYView,
        private readonly axis: MYAxis | MYAxis[] = "vertical"
    ) {
        super();
    }

    makeView(frame?: MYFrame): React.ReactNode {
        const isHorizontal = this.axis === "horizontal" || (Array.isArray(this.axis) && this.axis.includes("horizontal"));
        const isVertical = this.axis === "vertical" || (Array.isArray(this.axis) && this.axis.includes("vertical"));
        
        return (
            <MYBaseView
                frame={frame}
                dynamicStyle={{
                    style: (prev) => ({
                        ...prev,
                        overflowX: this.axis === "horizontal" || this.axis.includes("horizontal") ? "scroll" : "hidden",
                        overflowY: this.axis === "vertical" || this.axis.includes("vertical") ? "scroll" : "hidden",

                        width: this.axis === "horizontal" || this.axis.includes("vertical") ? "100%" : prev?.width,
                        height: this.axis === "vertical" || this.axis.includes("horizontal") ? "100%" : prev?.height,
                    })
                }}
            >
                {this.content.makeView()}
            </MYBaseView>
        );
    }

    get idealFrame(): MYFrame {
        return { maxWidth: Infinity, maxHeight: Infinity };
    }
}