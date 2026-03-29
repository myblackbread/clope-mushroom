import React from "react";
import { MYView } from "./View";
import { MYBaseView } from "../components/BaseView";

export class MYWindow {
    constructor(private readonly mainContent: MYView, private readonly hudLayer?: MYView) { }

    render(): React.ReactNode {
        return (
            <div style={{
                display: "grid",
                minWidth: "100vw",
                minHeight: "100vh",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "1fr",
            }}>
                <MYBaseView
                    frame={{ maxWidth: Infinity, maxHeight: Infinity }}
                    dynamicStyle={{
                        style: prev => ({
                            ...prev,
                            gridColumn: 1,
                            gridRow: 1,
                            flexDirection: "column",
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