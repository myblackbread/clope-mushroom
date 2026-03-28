import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYFrame } from "../types/Frame";

export class MYImage extends MYView {
    constructor(private readonly source: string | React.ReactNode) {
        super();
    }

    makeView(frame?: MYFrame): React.ReactNode {
        if (typeof this.source === "string") {
            return (
                <MYBaseView
                    element="img"
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