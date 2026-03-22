import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYShape } from "../shapes/Shape";
import { MYSize } from "../types/Size";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { MYBaseView } from "../components/BaseView";
import { MYRenderContext } from "../types/RenderContext";
import { MYFrame } from "../types/Frame";

const ClipShapeWrapper: React.FC<{ 
  frame?: MYFrame;
  renderContext?: MYRenderContext, 
  shape: MYShape; 
  children: React.ReactNode;
}> = ({ frame, renderContext, shape, children }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<MYSize>({ width: 0, height: 0 });

  useIsomorphicLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const clipPathValue = size.width > 0 && size.height > 0
    ? `path('${shape.path(size)}')` 
    : "none";

  return (
    <MYBaseView
      ref={containerRef}
      frame={frame}
      renderContext={renderContext}
      dynamicStyle={{
        style: (prev) => ({
            ...prev,
            clipPath: clipPathValue,
            WebkitClipPath: clipPathValue, 
            pointerEvents: "none"
        })
      }}
    >
      {children}
    </MYBaseView>
  );
};

export class MYClipShapeModifier implements MYViewModifier {
  constructor(private readonly shape: MYShape) {}

  body(content: React.ReactNode, context?: MYRenderContext, frame?: MYFrame): React.ReactNode {
    return <ClipShapeWrapper frame={frame} renderContext={context} shape={this.shape}>{content}</ClipShapeWrapper>;
  }
}