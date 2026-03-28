import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYScaleEffect } from "../types/ScaleEffect";
import { MYSize } from "../types/Size";
import { MYUnitPoint, unitPointMap } from "../types/UnitPoint";
import { MYAnyView, MYView } from "../core/View";

export class MYScaleEffectModifier implements MYViewModifier {
    constructor(private readonly value: MYScaleEffect) { }

    private getStyle(): React.CSSProperties {

        let scaleX: number | undefined;
        let scaleY: number | undefined;
        let anchor: MYUnitPoint | undefined;

        if (typeof this.value === "number") {
            scaleX = this.value;
            scaleY = this.value;
        } else if (this.isScaleS(this.value)) {
            scaleX = this.value.s;
            scaleY = this.value.s;
            anchor = this.value.anchor;
        } else if (this.isScaleSize(this.value)) {
            scaleX = this.value.scale.width;
            scaleY = this.value.scale.height;
            anchor = this.value.anchor;
        } else if (this.isScaleXY(this.value)) {
            scaleX = typeof this.value.x === "number" ? this.value.x : undefined;
            scaleY = typeof this.value.y === "number" ? this.value.y : undefined;
            anchor = this.value.anchor;
        }

        let transform: string | undefined;
        if (scaleX !== undefined && scaleY !== undefined) {
            transform = `scale(${scaleX}, ${scaleY})`;
        } else if (scaleX !== undefined) {
            transform = `scaleX(${scaleX})`;
        } else if (scaleY !== undefined) {
            transform = `scaleY(${scaleY})`;
        }

        return {
            transform,
            ...(anchor !== undefined && unitPointMap[anchor]
                ? { transformOrigin: unitPointMap[anchor] }
                : {})
        };
    }

    body(content: MYView): MYView {
        const style = this.getStyle();

        return new MYAnyView((parentFrame) => {
            if (!style.transform) return content.makeView(parentFrame);

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

    private isScaleS(val: any): val is { s: number; anchor?: MYUnitPoint } {
        return val && "s" in val && typeof val.s === "number";
    }

    private isScaleSize(val: any): val is { scale: MYSize; anchor?: MYUnitPoint } {
        return val && "scale" in val;
    }

    private isScaleXY(val: any): val is { x?: number; y?: number; anchor?: MYUnitPoint } {
        return val && (("x" in val && typeof val.x === "number") || ("y" in val && typeof val.y === "number"));
    }
}