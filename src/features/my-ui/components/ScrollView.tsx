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

    body(frame?: MYFrame): React.ReactNode {
        return (
            <MYBaseView
                frame={frame}
                dynamicStyle={{
                    style: (prev) => ({
                        ...prev,
                        overflowX: this.axis === "horizontal" || this.axis.includes("horizontal") ? "auto" : "hidden",
                        overflowY: this.axis === "vertical" || this.axis.includes("vertical") ? "auto" : "hidden",
                        
                        flexShrink: 1, 
                        minHeight: this.axis === "vertical" || this.axis.includes("horizontal") ? 0 : undefined,
                        minWidth: this.axis === "horizontal" || this.axis.includes("vertical") ? 0 : undefined,
                        
                        width: "100%",
                        height: "100%",
                        
                        pointerEvents: "auto", 
                        
                        display: "block", 
                    })
                }}
            >
                <div style={{ 
                    display: "flex", 
                    flexDirection: this.axis === "horizontal" ? "row" : "column",
                    width: this.axis === "horizontal" ? "fit-content" : "100%",
                    minHeight: this.axis === "vertical" ? "fit-content" : "100%", 
                    flexShrink: 0
                }}>
                    {this.content.body()}
                </div>
            </MYBaseView>
        );
    }

    get idealFrame(): MYFrame {
        return { maxWidth: Infinity, maxHeight: Infinity };
    }
}