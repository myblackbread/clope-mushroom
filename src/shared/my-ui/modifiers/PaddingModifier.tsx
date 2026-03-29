import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYEdgeInsets } from "../types/EdgeInsets";
import { MYPadding } from "../types/Padding";
import { MYAnyView, MYView } from "../core/View";

export class MYPaddingModifier implements MYViewModifier {
    constructor(private readonly value: MYPadding) { }

    private isEdgeInsets(value: MYPadding): value is MYEdgeInsets {
        if (typeof value !== "object") return false;
        const keys = ["top", "bottom", "left", "right"] as const;
        const hasKey = keys.some((k) => k in value);
        if (!hasKey) return false;
        return keys.every((k) => !(k in value) || typeof (value as any)[k] === "number");
    }

    private getStyle(): React.CSSProperties | undefined {
        if (this.isEdgeInsets(this.value)) {
            const { top, bottom, left, right } = this.value;
            return {
                paddingTop: top, paddingRight: right, paddingBottom: bottom, paddingLeft: left,
            };
        }

        const config = typeof this.value === "number" ? { length: this.value } : this.value;

        if ("length" in config) {
            const { edges = "all", length } = config;
            const edgesArray = Array.isArray(edges) ? edges : [edges];
            const uniqueEdges = Array.from(new Set(edgesArray));

            let top: number | undefined, bottom: number | undefined,
                left: number | undefined, right: number | undefined;

            uniqueEdges.forEach((edge) => {
                switch (edge) {
                    case "top": top = length; break;
                    case "bottom": bottom = length; break;
                    case "left": left = length; break;
                    case "right": right = length; break;
                    case "horizontal": left = length; right = length; break;
                    case "vertical": top = length; bottom = length; break;
                    case "all": top = length; bottom = length; left = length; right = length; break;
                }
            });

            return {
                paddingTop: top, paddingRight: right, paddingBottom: bottom, paddingLeft: left,
            };
        }
    }

    body(content: MYView): MYView {
        const style = this.getStyle();

        return new MYAnyView((parentFrame) => {
            if (!style) return content.makeView(parentFrame);

            const mergedFrame = { ...content.idealFrame, ...parentFrame };

            return (
                <MYBaseView
                    frame={mergedFrame}
                    dynamicStyle={{
                        style: (prev) => ({
                            ...prev,
                            ...style,
                            pointerEvents: "none"
                        })
                    }}
                >
                    {content.makeView(parentFrame)}
                </MYBaseView>
            );
        });
    }
}