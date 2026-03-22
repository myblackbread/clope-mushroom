import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYFrame } from "../types/Frame";
import { MYRenderContext } from "../types/RenderContext";

export class MYColor extends MYView {
    constructor(public readonly rawValue: string) {
        super();
    }

    static get red() { return new MYColor("red"); }
    static get green() { return new MYColor("green"); }
    static get blue() { return new MYColor("blue"); }
    static get black() { return new MYColor("black"); }
    static get white() { return new MYColor("white"); }
    static get clear() { return new MYColor("transparent"); }

    static rgb(r: number, g: number, b: number, a: number = 1) {
        return new MYColor(`rgba(${r}, ${g}, ${b}, ${a})`);
    }

    body(context?: MYRenderContext): React.ReactNode {
        return (
            <MYBaseView
                renderContext={context}
                dynamicStyle={{
                    style: (prev) => ({
                        ...prev,
                        backgroundColor: this.rawValue,
                        width: "100%",
                        height: "100%",
                        minWidth: 0,
                        minHeight: 0,
                        pointerEvents: this.rawValue === "transparent" ? "none" : undefined
                    })
                }}
            />
        );
    }

    get idealFrame(): MYFrame {
        return { maxWidth: Infinity, maxHeight: Infinity };
    }
}