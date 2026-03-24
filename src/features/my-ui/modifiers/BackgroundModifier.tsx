import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYView, MYAnyView } from "../core/View";
import { MYBaseView } from "../components/BaseView";
import { MYFrame } from "../types/Frame";

export type MYBackgroundImage = {
    url: string;
    repeat?: React.CSSProperties["backgroundRepeat"];
    position?: React.CSSProperties["backgroundPosition"];
    size?: React.CSSProperties["backgroundSize"];
};

export type MYBackgroundType = string | MYBackgroundImage | MYView;

export class MYBackgroundModifier implements MYViewModifier {
    constructor(private readonly background: MYBackgroundType) { }

    private renderBackground(frame?: MYFrame): React.ReactNode {
        if (typeof this.background === "string") {
            return <div style={{ width: "100%", height: "100%", background: this.background }} />;
        }

        if (this.background instanceof MYView) {
            return this.background.body(frame);
        }

        const { url, repeat, position, size } = this.background;
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${url})`,
                    backgroundRepeat: repeat || "no-repeat",
                    backgroundPosition: position || "center",
                    backgroundSize: size || "cover",
                }}
            />
        );
    }

    body(content: React.ReactNode, frame?: MYFrame): React.ReactNode {
        return (
            <MYBaseView
                frame={frame}
            >
                <div style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    display: "flex",
                    pointerEvents: "none"
                }}>
                    {new MYAnyView(this.renderBackground(frame))
                        .frame({ maxWidth: Infinity, maxHeight: Infinity })
                        .body(frame)}
                </div>
                {content}
            </MYBaseView>
        );
    }
}