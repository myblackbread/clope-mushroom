import React from "react";
import { MYAnyView, MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYBinding } from "../types/Binding";
import { MYFrame } from "../types/Frame";
import { MYRenderContextReact } from "../context/RenderContextReact";

const SliderInner: React.FC<{
    frame?: MYFrame;
    binding: MYBinding<number>;
    range: [number, number];
    step?: number;
}> = ({ frame, binding, range, step }) => {
    const context = React.useContext(MYRenderContextReact);
    const isDisabled = context?.disabled === true;

    const sliderBase = new MYAnyView(
        <MYBaseView
            element="input"
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
                    cursor: isDisabled ? "default" : "pointer",
                    pointerEvents: isDisabled ? "none" : "auto",
                    margin: 0
                })
            }}
        />
    );

    return sliderBase
        .frame({ maxWidth: Infinity })
        .opacity(isDisabled ? 0.5 : 1)
        .makeView(frame);
};

export class MYSlider extends MYView {
    constructor(
        private readonly value: MYBinding<number>,
        private readonly range: [number, number] = [0, 1],
        private readonly step?: number
    ) {
        super();
    }

    makeView(frame?: MYFrame): React.ReactNode {
        return (
            <SliderInner
                frame={frame}
                binding={this.value}
                range={this.range}
                step={this.step}
            />
        );
    }

    get idealFrame(): MYFrame {
        return { maxWidth: Infinity };
    }
}