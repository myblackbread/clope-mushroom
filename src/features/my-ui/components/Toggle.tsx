import React from "react";
import { MYView, MYAnyView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYBinding } from "../types/Binding";
import { MYFrame } from "../types/Frame";
import { MYHStack } from "../stacks/HStack";
import { MYSpacer } from "./Spacer";
import { MYRenderContextReact } from "../context/RenderContextReact";

const ToggleSwitch: React.FC<{
    binding: MYBinding<boolean>;
}> = ({ binding }) => {
    const context = React.useContext(MYRenderContextReact);
    const isDisabled = context?.disabled === true;

    return (
        <MYBaseView
            element="input"
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

const ToggleInner: React.FC<{
    isOn: MYBinding<boolean>;
    label: MYView;
    frame?: MYFrame;
}> = ({ isOn, label, frame }) => {
    const context = React.useContext(MYRenderContextReact);
    const isDisabled = context?.disabled === true;

    const toggleLayout = new MYHStack([
        label,
        new MYSpacer(),
        new MYAnyView(<ToggleSwitch binding={isOn} />)
    ]);

    return toggleLayout
        .opacity(isDisabled ? 0.5 : 1)
        .makeView(frame);
};

export class MYToggle extends MYView {
    constructor(
        private readonly isOn: MYBinding<boolean>,
        private readonly label: MYView
    ) {
        super();
    }

    makeView(frame?: MYFrame): React.ReactNode {
        return (
            <ToggleInner
                isOn={this.isOn}
                label={this.label}
                frame={frame}
            />
        );
    }

    get idealFrame(): MYFrame {
        return { maxWidth: Infinity };
    }
}