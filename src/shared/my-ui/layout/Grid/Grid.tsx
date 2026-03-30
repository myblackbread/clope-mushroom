import React from "react";
import { MYContainerView } from "../../core/ContainerView";
import { MYDynamicStyle } from "../../types/DynamicStyle";
import { MYFrame } from "../../types/Frame";
import { MYGridRow } from "./GridRow";
import { MYAnyViewChild } from "../../types/AnyViewChild";

export class MYGrid extends MYContainerView<"div"> {
    private maxColumns: number = 1;

    constructor(
        children: MYAnyViewChild[],
        private readonly horizontalSpacing: number = 8,
        private readonly verticalSpacing: number = 8
    ) {
        super(children);

        this.children.forEach(child => {
            if (child instanceof MYGridRow) {
                this.maxColumns = Math.max(this.maxColumns, child.childrenCount);
            }
        });
    }

    get idealFrame(): MYFrame {
        const baseFrame = super.idealFrame;
        baseFrame.maxWidth = Infinity; 
        return baseFrame;
    }

    protected getChildWrapperStyle(index: number): React.CSSProperties {
        const child = this.children[index];
        const baseStyle = super.getChildWrapperStyle(index);

        if (child instanceof MYGridRow) {
            return { ...baseStyle, display: "contents" };
        }

        return {
            ...baseStyle,
            gridColumn: `1 / -1`
        };
    }

    protected get dynamicStyle(): MYDynamicStyle<"div"> {
        return {
            style: (prev) => ({
                ...prev,
                display: "grid",
                gridTemplateColumns: `repeat(${this.maxColumns}, auto)`,
                columnGap: this.horizontalSpacing,
                rowGap: this.verticalSpacing,
                alignItems: "center",
                justifyItems: "start"
            })
        };
    }
}