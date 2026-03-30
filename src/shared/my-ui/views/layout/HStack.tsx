import React from "react";
import { MYVerticalAlignment } from "../../types/VerticalAlignment";
import { MYFrame } from "../../types/Frame";
import { MYContainerView } from "../../core/ContainerView";
import { MYDynamicStyle } from "../../types/DynamicStyle";
import { MYAnyViewChild } from "../../types/AnyViewChild";

export class MYHStack extends MYContainerView<"div"> {
    constructor(
        children: MYAnyViewChild[],
        private readonly spacing: number = 8,
        private readonly alignment: MYVerticalAlignment = "center"
    ) {
        super(children);
    }

    get idealFrame(): MYFrame {
        const baseFrame = super.idealFrame;
        if (this.hasSpacer) {
            baseFrame.maxWidth = Infinity;
        }
        return baseFrame;
    }

    private getAlignItems(): string {
        switch (this.alignment) {
            case "top": return "flex-start";
            case "bottom": return "flex-end";
            case "center":
            default: return "center";
        }
    }

    protected getChildWrapperStyle(index: number): React.CSSProperties {
        return {
            ...super.getChildWrapperStyle(index),
            display: "contents"
        };
    }

    protected get dynamicStyle(): MYDynamicStyle<"div"> {
        return {
            style: (prev) => ({
                ...prev,
                display: "flex",
                flexDirection: "row",
                gap: this.spacing,
                justifyContent: "center",
                alignItems: this.getAlignItems()
            })
        };
    }
}