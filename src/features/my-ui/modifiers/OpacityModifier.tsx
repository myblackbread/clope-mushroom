import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYOpacity } from "../types/Opacity";
import { MYFrame } from "../types/Frame";

export class MYOpacityModifier implements MYViewModifier {
    constructor(private readonly value: MYOpacity) { }

    body(content: React.ReactNode, frame?: MYFrame): React.ReactNode {
        if (!isFinite(this.value)) {
            return content;
        }

        return (
            <MYBaseView
                frame={frame}
                dynamicStyle={{
                    style: (prev) => ({
                        ...prev,
                        opacity: this.value,
                        pointerEvents: "none"
                    })
                }}
            >
                {content}
            </MYBaseView>
        );
    }
}