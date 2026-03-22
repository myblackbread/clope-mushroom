import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYFrame } from "../types/Frame";

export class MYImage extends MYView {
    constructor(private readonly source: string | React.ReactNode) {
        super();
    }

    body(context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
        if (typeof this.source === "string") {
            return (
                <MYBaseView
                    element="img"
                    renderContext={context}
                    dynamicStyle={{
                        src: () => this.source as string,
                        style: (prev) => ({
                            ...prev,
                            maxWidth: "100%", 
                            maxHeight: "100%",
                            objectFit: "contain",
                            pointerEvents: "none"
                        })
                    }}
                />
            );
        }

        return (
            <MYBaseView
                renderContext={context}
                dynamicStyle={{
                    style: (prev) => ({
                        ...prev,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                    })
                }}
            >
                {this.source}
            </MYBaseView>
        );
    }
}