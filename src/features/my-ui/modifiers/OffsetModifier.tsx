import { isSize } from "../types/Size";
import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYOffset } from "../types/Offset";
import { MYAnyView, MYView } from "../core/View";

export class MYOffsetModifier implements MYViewModifier {
    constructor(private readonly value: MYOffset) { }

    body(content: MYView): MYView {
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

        return new MYAnyView((parentFrame) => {
            if (!translate) {
                return content.makeView(parentFrame);
            }

            const mergedFrame = { ...content.idealFrame, ...parentFrame };

            return (
                <MYBaseView
                    frame={mergedFrame}
                    dynamicStyle={{
                        style: (prev) => ({
                            ...prev,
                            transform: translate,
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