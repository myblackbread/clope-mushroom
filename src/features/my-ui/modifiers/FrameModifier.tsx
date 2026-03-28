import { MYViewModifier } from "../core/ViewModifier";
import { MYBaseView } from "../components/BaseView";
import { MYFrame } from "../types/Frame";
import { AlignmentMap } from "../types/Alignment";
import { MYAnyView, MYView } from "../core/View";

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

  body(content: MYView): MYView {
    const alignValue = this.value.alignment || "center";
    const alignStyles = AlignmentMap[alignValue];

    return new MYAnyView((parentFrame) => {
      const baseFrame = mergeFrames(content.idealFrame, parentFrame);
      const mergedFrame = mergeFrames(baseFrame, this.value);
      
      return (
        <MYBaseView
          frame={mergedFrame}
          dynamicStyle={{
            style: (prev) => ({
              ...prev,
              ...alignStyles,
              pointerEvents: "none"
            })
          }}
        >
          {content.makeView(parentFrame)}
        </MYBaseView>
      );
    });
  }

  sizeThatFits(contentFrame: MYFrame): MYFrame {
    return mergeFrames(contentFrame, this.value);
  }
}