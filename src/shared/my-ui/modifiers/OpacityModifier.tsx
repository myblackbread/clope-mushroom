import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYOpacity } from "../types/Opacity";
import { MYAnyView, MYView } from "../core/View";

export class MYOpacityModifier implements MYViewModifier {
    constructor(private readonly value: MYOpacity) { }

    body(content: MYView): MYView {
        return new MYAnyView((parentFrame) => {
            if (!isFinite(this.value)) {
                return content.makeView(parentFrame);
            }

            const mergedFrame = { ...content.idealFrame, ...parentFrame };

            return (
                <MYBaseView
                    frame={mergedFrame}
                    dynamicStyle={{
                        style: (prev) => ({
                            ...prev,
                            opacity: this.value,
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