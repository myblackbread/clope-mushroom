import React from "react";
import { MYView } from "../core/View";
import { MYSize } from "../types/Size";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { MYShapeFillModifier } from "../modifiers/ShapeFillModifier";
import { MYBaseView } from "../components/BaseView";
import { MYColorType } from "../types/ColorType";
import { MYFrame } from "../types/Frame";

const ShapeRenderer: React.FC<{ shape: MYShape }> = ({ shape }) => {
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

  return (
    <MYBaseView
      ref={containerRef}
      dynamicStyle={{
        style: (prev) => ({
          ...prev,
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0
        })
      }}
    >
      {size.width > 0 && size.height > 0 && (
        <svg
          width={size.width}
          height={size.height}
          style={{
            overflow: "visible",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          <path d={shape.path(size)} fill="currentColor" />
        </svg>
      )}
    </MYBaseView>
  );
};

export abstract class MYShape extends MYView {
  abstract path(container: MYSize): string;

  body(): React.ReactNode {
    return <ShapeRenderer shape={this} />;
  }

  get idealFrame(): MYFrame {
    return { maxWidth: Infinity, maxHeight: Infinity };
  }

  fill(color: MYColorType): MYView {
    return this.modifier(new MYShapeFillModifier(color));
  }
}