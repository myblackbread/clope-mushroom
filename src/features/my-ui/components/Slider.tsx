import React from "react";
import { MYAnyView, MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYBinding } from "../types/Binding";
import { MYFrame } from "../types/Frame";

const SliderInner: React.FC<{
    binding: MYBinding<number>;
    range: [number, number];
    step?: number;
    context?: MYRenderContext;
}> = ({ binding, range, step, context }) => {
    const isDisabled = context?.disabled === true;
    return (
        <MYBaseView
            element="input"
            renderContext={context}
            dynamicStyle={{
                type: () => "range",
                min: () => range[0],
                max: () => range[1],
                step: () => step,
                value: () => binding.wrappedValue,
                disabled: () => isDisabled,
                onChange: (prev) => (e) => {
                    if (isDisabled) return;
                    if (prev) prev(e);
                    binding.wrappedValue = parseFloat(e.target.value);
                },
                style: (prev) => ({
                    ...prev,
                    width: "100%",
                    cursor: "pointer",
                    pointerEvents: isDisabled ? "none" : "auto",
                    opacity: isDisabled ? 0.5 : 1,
                    margin: 0
                })
            }}
        />
    );
};

export class MYSlider extends MYView {
    constructor(
        private readonly value: MYBinding<number>,
        private readonly range: [number, number] = [0, 1],
        private readonly step?: number
    ) {
        super();
    }

    body(context?: MYRenderContext, frame?: MYFrame): React.ReactNode {

        const isDisabled = context?.disabled === true;

        const sliderView = new MYAnyView(
            <SliderInner
                binding={this.value}
                range={this.range}
                step={this.step}
                context={context}
            />
        );

        return isDisabled
            ? sliderView.opacity(0.5).body(context, frame)
            : sliderView.body();
    }

    get idealFrame(): MYFrame {
        return { maxWidth: Infinity };
    }
}