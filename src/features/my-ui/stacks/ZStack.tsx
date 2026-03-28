import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "../components/BaseView";
import { MYAlignment, AlignmentMap } from "../types/Alignment";
import { isFlexible, MYFrame } from "../types/Frame";
import { MYAnyViewChild, MYContainerView } from "../core/ContainerView";
import { MYDynamicStyle } from "../types/DynamicStyle";

export class MYZStack extends MYContainerView<"div"> {
    constructor(
        children: MYAnyViewChild[],
        private readonly alignment: MYAlignment = "center"
    ) {
        super(children);
    }

    get idealFrame(): MYFrame {
        const baseFrame = super.idealFrame;
        if (this.hasSpacer) {
            baseFrame.maxWidth = Infinity;
            baseFrame.maxHeight = Infinity;
        }
        return baseFrame;
    }

    protected get dynamicStyle(): MYDynamicStyle<"div"> {
        return {
            style: prev => ({
                ...prev,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr)",
                gridTemplateRows: "minmax(0, 1fr)",
            })
        };
    }

    protected getChildWrapperStyle(index: number): React.CSSProperties {
        const alignStyles = AlignmentMap[this.alignment] || AlignmentMap.center;

        return {
            ...super.getChildWrapperStyle(index),
            gridColumn: 1,
            gridRow: 1,
            minWidth: 0,
            minHeight: 0,
            ...alignStyles
        };
    }
}