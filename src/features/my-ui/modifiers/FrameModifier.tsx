import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYFrame } from "../types/Frame";
import { AlignmentMap } from "../types/Alignment";

function mergeFrames(oldFrame: MYFrame = {}, newFrame: MYFrame = {}): MYFrame {
  const merged = { ...oldFrame, ...newFrame };

  if (newFrame.width !== undefined) {
    if (newFrame.minWidth === undefined) delete merged.minWidth;
    if (newFrame.maxWidth === undefined) delete merged.maxWidth;
  }

  if (newFrame.height !== undefined) {
    if (newFrame.minHeight === undefined) delete merged.minHeight;
    if (newFrame.maxHeight === undefined) delete merged.maxHeight;
  }

  return merged;
}

export class MYFrameModifier implements MYViewModifier {
  constructor(private readonly value: MYFrame) { }

  body(content: React.ReactNode, frame?: MYFrame): React.ReactNode {
    const alignStyles = this.value.alignment ? AlignmentMap[this.value.alignment] : {};

    return (
      <MYBaseView
        frame={{ ...frame, ...this.value }}
        dynamicStyle={{
          style: (prev) => ({
            ...prev,
            ...alignStyles,
            pointerEvents: "none"
          })
        }}
      >
        {content}
      </MYBaseView>
    );
  }

  sizeThatFits(contentFrame: MYFrame): MYFrame {
    return mergeFrames(contentFrame, this.value);
  }
}