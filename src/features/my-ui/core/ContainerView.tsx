import React, { CSSProperties } from "react";
import { MYView } from "./View";
import { MYBaseView } from "../components/BaseView";
import { MYFrame, isFlexible } from "../types/Frame";
import { MYRenderContext } from "../types/RenderContext";
import { MYDynamicStyle } from "../types/DynamicStyle";

export type MYAnyViewChild = MYView | null | undefined | boolean;

export abstract class MYContainerView<K extends keyof HTMLElementTagNameMap = "div"> extends MYView {
    constructor(protected readonly children: MYAnyViewChild[]) {
        super();
    }

    protected get elementType(): K {
        return "div" as K;
    }

    get idealFrame(): MYFrame {
        let needsFlexWidth = false;
        let needsFlexHeight = false;

        for (const child of this.children) {
            if (!(child instanceof MYView)) continue;
            const childFrame = child.idealFrame;
            if (isFlexible(childFrame.width) || isFlexible(childFrame.maxWidth)) needsFlexWidth = true;
            if (isFlexible(childFrame.height) || isFlexible(childFrame.maxHeight)) needsFlexHeight = true;
        }

        return {
            ...(needsFlexWidth ? { width: "100%" } : {}),
            ...(needsFlexHeight ? { height: "100%" } : {})
        };
    }

    protected abstract get dynamicStyle(): MYDynamicStyle<K>;

    body(context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
        const prefFrame = this.idealFrame;
        const childDynamicStyle = this.dynamicStyle;

        const baseDynamicStyle: MYDynamicStyle<K> = {
            style: (prev) => ({
                ...prev,
                pointerEvents: "none",
            })
        } as MYDynamicStyle<K>;

        const mergedDynamicStyle: MYDynamicStyle<K> = { ...baseDynamicStyle };

        if (childDynamicStyle) {
            const keys = Object.keys(childDynamicStyle) as Array<keyof MYDynamicStyle<K>>;
            for (const key of keys) {
                const baseUpdater = mergedDynamicStyle[key] as any;
                const childUpdater = childDynamicStyle[key] as any;

                if (baseUpdater && childUpdater) {
                    mergedDynamicStyle[key] = (prev: any) => childUpdater(baseUpdater(prev));
                } else if (childUpdater) {
                    mergedDynamicStyle[key] = childUpdater;
                }
            }
        }

        return (
            <MYBaseView
                element={this.elementType}
                frame={{ ...prefFrame, ...frame }}
                renderContext={context}
                dynamicStyle={mergedDynamicStyle}
            >
                {this.renderContent(context)}
            </MYBaseView>
        );
    }

    protected get hasSpacer(): boolean {
        return this.children.some(child => child instanceof MYView && child.isSpacer);
    }

    protected getChildWrapperStyle(index: number): React.CSSProperties {
        return { pointerEvents: "none" };
    }

    protected prepareChild(child: MYView, index: number): MYView {
        return child;
    }

    private renderContent(context?: MYRenderContext): React.ReactNode {
        return this.children.map((child, index) => {
            if (!(child instanceof MYView)) return null;
            return (
                <MYBaseView
                    frame={{ maxWidth: Infinity, maxHeight: Infinity }}
                    key={index}
                    renderContext={context}
                    dynamicStyle={{ style: (prev) => ({ ...prev, ...this.getChildWrapperStyle(index) }) }}
                >
                    {child.body(context)}
                </MYBaseView>
            );
        });
    }
}