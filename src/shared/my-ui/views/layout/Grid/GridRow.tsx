import { MYContainerView } from "../../../core/ContainerView";
import { MYAnyViewChild } from "../../../types/AnyViewChild";
import { MYView } from "../../../core/View";
import { MYDynamicStyle } from "../../../types/DynamicStyle";

export class MYGridRow extends MYContainerView<"div"> {
    constructor(children: MYAnyViewChild[]) {
        super(children);
    }

    get childrenCount(): number {
        return this.children.filter(c => c instanceof MYView).length;
    }

    protected get dynamicStyle(): MYDynamicStyle<"div"> {
        return {
            style: prev => ({
                ...prev,
                display: "contents",
            })
        };
    }
}