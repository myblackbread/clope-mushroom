
import React, { useRef, useState } from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";
import { MYFrame } from "../types/Frame";
import { MYGeometryProxy } from "../types/GeometryProxy";
import { MYSize } from "../types/Size";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";

const GeometryReaderInner: React.FC<{
    content: (proxy: MYGeometryProxy) => MYView;
    frame?: MYFrame;
}> = ({ content, frame }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<MYSize>({ width: 0, height: 0 });

    useIsomorphicLayoutEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const updateSize = () => {
            setSize({ width: element.clientWidth, height: element.clientHeight });
        };

        updateSize();
        
        const observer = new ResizeObserver(updateSize);
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const proxy: MYGeometryProxy = { size };
    const childView = content(proxy);

    return (
        <MYBaseView
            ref={containerRef}
            frame={frame}
            dynamicStyle={{
                style: (prev) => ({
                    ...prev,
                    width: "100%",
                    height: "100%",
                    flexGrow: 1,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    pointerEvents: "none"
                })
            }}
        >
            {childView.makeView()}
        </MYBaseView>
    );
};

export class MYGeometryReader extends MYView {
    constructor(private readonly content: (proxy: MYGeometryProxy) => MYView) {
        super();
    }

    makeView(frame?: MYFrame): React.ReactNode {
        return <GeometryReaderInner content={this.content} frame={frame} />;
    }

    get idealFrame(): MYFrame {
        return { maxWidth: Infinity, maxHeight: Infinity };
    }
}