import React from "react";
import { MYAlignment, AlignmentMap } from "../../types/Alignment";
import { MYFrame } from "../../types/Frame";
import { MYContainerView } from "../../core/ContainerView";
import { MYDynamicStyle } from "../../types/DynamicStyle";
import { MYAnyViewChild } from "../../types/AnyViewChild";

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
                placeItems: "center",
                minWidth: "max-content",
                minHeight: "max-content",
            })
        };
    }

    protected getChildWrapperStyle(index: number): React.CSSProperties {
        const alignStyles = AlignmentMap[this.alignment] || AlignmentMap.center;

        const justifyGrid = alignStyles.justifyContent === 'flex-start' ? 'start' : alignStyles.justifyContent === 'flex-end' ? 'end' : 'center';
        const alignGrid = alignStyles.alignItems === 'flex-start' ? 'start' : alignStyles.alignItems === 'flex-end' ? 'end' : 'center';

        return {
            ...super.getChildWrapperStyle(index),
            gridColumn: "1 / -1",
            gridRow: "1 / -1",
            justifyContent: justifyGrid,
            alignItems: alignGrid
        };
    }
}