import { CSSProperties } from "react";
import { MYSize, isSize } from "../types/Size";
import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYOffset } from "../types/Offset";
import { MYFrame } from "../types/Frame"

export class MYOffsetModifier implements MYViewModifier {
    constructor(private readonly value: MYOffset) { }

    body(content: React.ReactNode, context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
        let x: number | undefined;
        let y: number | undefined;

        if (isSize(this.value)) {
            x = this.value.width;
            y = this.value.height;
        } else if (false
            || "x" in this.value && typeof this.value.x === "number" && isFinite(this.value.x)
            || "y" in this.value && typeof this.value.y === "number" && isFinite(this.value.y)
        ) {
            x = this.value.x;
            y = this.value.y;
        }

        let translate: string | undefined;

        if (x !== undefined && y !== undefined) {
            translate = `translate(${x}px, ${y}px)`;
        } else if (x !== undefined) {
            translate = `translateX(${x}px)`;
        } else if (y !== undefined) {
            translate = `translateY(${y}px)`;
        }

        return (
            <MYBaseView
                frame={frame}
                renderContext={context}
                dynamicStyle={{
                    style: (prev) => ({
                        ...prev,
                        transform: translate,
                        pointerEvents: "none"
                    })
                }}
            >
                {content}
            </MYBaseView>
        );
    }
}