import React from "react";
import { MYView } from "./View";
import { MYBaseView } from "../react-bridge/BaseView";

export class MYWindow {
    constructor(private readonly mainContent: MYView, private readonly hudLayer?: MYView) { }

    render(): React.ReactNode {
        return (
            <div style={{
                display: "grid",
                minWidth: "100dvw",
                minHeight: "100dvh",
            }}>
                <MYBaseView
                    frame={{ maxWidth: Infinity, maxHeight: Infinity }}
                    dynamicStyle={{
                        style: prev => ({
                            ...prev,
                            gridColumn: "1 / -1",
                            gridRow: "1 / -1",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                        })
                    }}
                >
                    {this.mainContent.makeView()}
                </MYBaseView>

                {this.hudLayer && (
                    <MYBaseView
                        frame={{ maxWidth: Infinity, maxHeight: Infinity }}
                        dynamicStyle={{
                            style: prev => ({
                                ...prev,
                                position: "fixed",
                                inset: 0,
                                pointerEvents: "none",
                                zIndex: 9999,
                                justifyContent: "center",
                                alignItems: "center",
                            })
                        }}
                    >
                        {this.hudLayer.makeView()}
                    </MYBaseView>
                )}
            </div>
        );
    }
}