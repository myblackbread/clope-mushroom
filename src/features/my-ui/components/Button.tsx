import React from "react";
import { MYView, MYAnyView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYColor } from "./Color";
import { MYFrame } from "../types/Frame";
import { MYRenderContextReact } from "../context/RenderContextReact";

const ButtonInner: React.FC<{
    frame?: MYFrame;
    action: () => void;
    children: MYView;
}> = ({ frame, action, children }) => {
    const context = React.useContext(MYRenderContextReact);

    const [isPressed, setIsPressed] = React.useState(false);
    const isPressedRef = React.useRef(false);
    const isDisabled = context?.disabled === true;

    const pressOverlay = MYColor.rgb(1, 1, 1, isPressed && !isDisabled ? 0.3 : 0).allowsHitTesting(false);

    const hitTestLayer = new MYAnyView(
        <MYBaseView
            element="button"
            frame={{ maxWidth: Infinity, maxHeight: Infinity }}
            dynamicStyle={{
                style: (prev) => ({
                    ...prev,
                    cursor: isDisabled ? "default" : "pointer",
                    pointerEvents: isDisabled ? "none" : "auto",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent"
                }),
                onPointerDown: (prev) => (e) => {
                    if (prev) prev(e);
                    isPressedRef.current = true;
                    setIsPressed(true);
                    try {
                        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    } catch (err) { }
                },
                onPointerUp: (prev) => (e) => {
                    if (prev) prev(e);
                    if (isPressedRef.current) {
                        isPressedRef.current = false;
                        setIsPressed(false);
                        action();
                    }
                    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
                },
                onPointerCancel: (prev) => (e) => {
                    if (prev) prev(e);
                    isPressedRef.current = false;
                    setIsPressed(false);
                },
                onPointerLeave: (prev) => (e) => {
                    if (prev) prev(e);
                    isPressedRef.current = false;
                    setIsPressed(false);
                },
                onContextMenu: (prev) => (e) => {
                    if (prev) prev(e);
                    e.preventDefault();
                }
            }}
        />
    );

    return new MYAnyView(children.makeView(frame))
        .frame(children.idealFrame)
        .overlay(pressOverlay)
        .overlay(hitTestLayer)
        .opacity(isDisabled ? 0.5 : 1)
        .makeView(frame);
};

export class MYButton extends MYView {
    constructor(
        private readonly action: () => void,
        private readonly label: MYView
    ) {
        super();
    }

    makeView(frame?: MYFrame): React.ReactNode {
        return <ButtonInner
            frame={frame}
            action={this.action}
            children={this.label}
        />;
    }

    get idealFrame(): MYFrame {
        return this.label.idealFrame;
    }
}