import React from "react";
import { MYViewModifier } from "./ViewModifier";
import { MYFrameModifier } from "../modifiers/FrameModifier";
import { MYOnAppearModifier } from "../modifiers/OnAppearModifier";
import { MYAllowsHitTestingModifier } from "../modifiers/AllowsHitTestingModifier";
import { MYOnChangeModifier } from "../modifiers/OnChangeModifier";
import { MYBackgroundModifier, MYBackgroundType } from "../modifiers/BackgroundModifier";
import { MYOverlayModifier } from "../modifiers/OverlayModifier";
import { MYShape } from "../shapes/Shape";
import { MYClipShapeModifier } from "../modifiers/ClipShapeModifier";
import { MYOffsetModifier } from "../modifiers/OffsetModifier";
import { MYOnDisappearModifier } from "../modifiers/OnDisappearModifier";
import { MYOpacity } from "../types/Opacity";
import { MYOpacityModifier } from "../modifiers/OpacityModifier";
import { MYPadding } from "../types/Padding";
import { MYPaddingModifier } from "../modifiers/PaddingModifier";
import { MYScaleEffect } from "../types/ScaleEffect";
import { MYScaleEffectModifier } from "../modifiers/ScaleEffectModifier";
import { MYFrame } from "../types/Frame";
import { MYRenderContext } from "../types/RenderContext";
import { MYAnimation, MYAnimations } from "../types/Animation";
import { MYAnimationModifier } from "../modifiers/AnimationModifier";
import { MYOffset } from "../types/Offset";
import { MYOverlayType } from "../types/OverlayType";
import { MYFontModifier, MYFontWeightModifier } from "../modifiers/FontModifier";
import { MYFont, MYFontWeight } from "../types/Font";
import { MYForegroundStyle } from "../types/ForegroundStyle";
import { MYForegroundStyleModifier } from "../modifiers/ForegroundStyleModifier";
import { MYDisabledModifier } from "../modifiers/DisabledModifier";

export abstract class MYView {
  abstract body(context?: MYRenderContext, frame?: MYFrame): React.ReactNode;

  get idealFrame(): MYFrame {
    return {};
  }

  get isSpacer(): boolean {
    return false;
  }

  static from(node: React.ReactNode): MYView {
    return new MYAnyView(node);
  }

  modifier(mod: MYViewModifier): MYView {
    return new MYModifiedContent(this, mod);
  }

  allowsHitTesting(enabled: boolean): MYView {
    return this.modifier(new MYAllowsHitTestingModifier(enabled));
  }

  animation(anim: MYAnimation = MYAnimations.default): MYView {
    return this.modifier(new MYAnimationModifier(anim));
  }

  background(bg: MYBackgroundType): MYView {
    return this.modifier(new MYBackgroundModifier(bg));
  }

  clipShape(shape: MYShape): MYView {
    return this.modifier(new MYClipShapeModifier(shape));
  }

  disabled(isDisabled: boolean = true): MYView {
    return this.modifier(new MYDisabledModifier(isDisabled));
  }

  frame(value: MYFrame): MYView {
    return this.modifier(new MYFrameModifier(value));
  }

  font(font: MYFont): MYView {
    return this.modifier(new MYFontModifier(font));
  }

  fontWeight(weight: MYFontWeight): MYView {
    return this.modifier(new MYFontWeightModifier(weight));
  }

  foregroundStyle(style: MYForegroundStyle): MYView {
    return this.modifier(new MYForegroundStyleModifier(style));
  }

  offset(offset: MYOffset): MYView {
    return this.modifier(new MYOffsetModifier(offset))
  }

  onChange<T>(of: T, action: (oldValue: T, newValue: T) => void, initial?: boolean): MYView {
    return this.modifier(new MYOnChangeModifier(of, action, initial));
  }

  onAppear(action: () => void): MYView {
    return this.modifier(new MYOnAppearModifier(action));
  }

  onDisappear(action: () => void): MYView {
    return this.modifier(new MYOnDisappearModifier(action));
  }

  opacity(value: MYOpacity): MYView {
    return this.modifier(new MYOpacityModifier(value));
  }

  overlay(ov: MYOverlayType): MYView {
    return this.modifier(new MYOverlayModifier(ov));
  }

  padding(value: MYPadding): MYView {
    return this.modifier(new MYPaddingModifier(value));
  }

  scaleEffect(value: MYScaleEffect): MYView {
    return this.modifier(new MYScaleEffectModifier(value));
  }
}

class MYModifiedContent extends MYView {
  constructor(
    private readonly content: MYView,
    private readonly modifierRule: MYViewModifier
  ) {
    super();
  }

  body(context?: MYRenderContext): React.ReactNode {
    const nextContext = this.modifierRule.transformContext
      ? this.modifierRule.transformContext(context)
      : context;

    const childNode = this.content.body(nextContext);

    return this.modifierRule.body(childNode, nextContext, this.idealFrame);
  }

  get idealFrame(): MYFrame {
    const childFrame = this.content.idealFrame;
    if (this.modifierRule.sizeThatFits) {
      return this.modifierRule.sizeThatFits(childFrame);
    }

    return childFrame;
  }

  get isSpacer(): boolean {
    return this.content.isSpacer;
  }
}

export class MYAnyView extends MYView {
  constructor(private readonly node: React.ReactNode) {
    super()
  }

  body(): React.ReactNode {
    return this.node;
  }

  get idealFrame(): MYFrame {
    return {};
  }
}