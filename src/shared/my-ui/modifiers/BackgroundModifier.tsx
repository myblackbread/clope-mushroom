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
            return this.background.makeView(frame);
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

    body(content: MYView): MYView {
        return new MYAnyView((parentFrame) => {
            const mergedFrame = { ...content.idealFrame, ...parentFrame };

            return (
                <MYBaseView frame={mergedFrame}>
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                        display: "flex",
                        pointerEvents: "none",
                        zIndex: -1
                    }}>
                        {new MYAnyView(this.renderBackground(parentFrame))
                            .frame({ maxWidth: Infinity, maxHeight: Infinity })
                            .makeView(parentFrame)}
                    </div>

                    {content.makeView(parentFrame)}
                </MYBaseView>
            );
        });
    }
}