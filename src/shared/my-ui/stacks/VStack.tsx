import React from "react";
import { MYHorizontalAlignment } from "../types/HorizontalAlignment";
import { MYFrame } from "../types/Frame";
import { MYAnyViewChild, MYContainerView } from "../core/ContainerView";
import { MYDynamicStyle } from "../types/DynamicStyle";

export class MYVStack extends MYContainerView<"div"> {
    constructor(
        children: MYAnyViewChild[],
        private readonly spacing: number = 8,
        private readonly alignment: MYHorizontalAlignment = "center"
    ) {
        super(children);
    }

    get idealFrame(): MYFrame {
        const baseFrame = super.idealFrame;
        if (this.hasSpacer) {
            baseFrame.maxHeight = Infinity;
        }
        return baseFrame;
    }

    private getAlignItems(): string {
        switch (this.alignment) {
            case "left": return "flex-start";
            case "right": return "flex-end";
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
                flexDirection: "column",
                gap: this.spacing,
                justifyContent: "center",
                alignItems: this.getAlignItems()
            })
        };
    }
}