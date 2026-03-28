import React from "react";
import { MYAnyViewChild, MYContainerView } from "../core/ContainerView";
import { MYDynamicStyle } from "../types/DynamicStyle";
import { MYFrame } from "../types/Frame";

export class MYGrid extends MYContainerView<"div"> {
    constructor(
        children: MYAnyViewChild[],
        private readonly columns: number | string = 2,
        private readonly spacing: number = 8,
        private readonly rowSpacing?: number
    ) {
        super(children);
    }

    get idealFrame(): MYFrame {
        const baseFrame = super.idealFrame;
        baseFrame.maxWidth = Infinity; 
        return baseFrame;
    }

    protected get dynamicStyle(): MYDynamicStyle<"div"> {
        const gridCols = typeof this.columns === 'number'
            ? `repeat(${this.columns}, minmax(0, 1fr))`
            : this.columns;

        return {
            style: (prev) => ({
                ...prev,
                display: "grid",
                gridTemplateColumns: gridCols,
                columnGap: this.spacing,
                rowGap: this.rowSpacing ?? this.spacing,
                alignItems: "start"
            })
        };
    }
}