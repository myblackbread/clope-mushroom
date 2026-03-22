import React from "react";
import { MYView, MYAnyView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYBinding } from "../types/Binding";
import { MYFrame } from "../types/Frame";
import { MYHStack } from "../stacks/HStack";
import { MYSpacer } from "./Spacer";

const ToggleSwitch: React.FC<{
    binding: MYBinding<boolean>;
    context?: MYRenderContext;
}> = ({ binding, context }) => {
    const isDisabled = context?.disabled === true;

    return (
        <MYBaseView<"input">
            element="input"
            renderContext={context}
            dynamicStyle={{
                type: () => "checkbox",
                checked: () => binding.wrappedValue,
                disabled: () => isDisabled,
                onChange: (prev) => (e) => {
                    if (isDisabled) return;
                    if (prev) prev(e);
                    binding.wrappedValue = e.target.checked;
                },
                style: (prev) => ({
                    ...prev,
                    cursor: isDisabled ? "default" : "pointer",
                    pointerEvents: isDisabled ? "none" : "auto",
                    width: "20px",
                    height: "20px",
                    margin: 0
                })
            }}
        />
    );
};

export class MYToggle extends MYView {
    constructor(
        private readonly isOn: MYBinding<boolean>,
        private readonly label: MYView
    ) {
        super();
    }

    body(context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
        const isDisabled = context?.disabled === true;

        const toggleLayout = new MYHStack([
            this.label,
            new MYSpacer(),
            new MYAnyView(<ToggleSwitch binding={this.isOn} context={context} />)
        ]);

        return isDisabled
            ? toggleLayout.opacity(0.5).body(context, frame)
            : toggleLayout.body(context, frame);
    }

    get idealFrame(): MYFrame {
        return { maxWidth: Infinity };
    }
}