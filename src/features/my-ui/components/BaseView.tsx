import React from "react";
import { MYDynamicStyle } from "../types/DynamicStyle";
import { MYBaseViewProps } from "../types/BaseViewProps";
import { frameToStyle } from "../utils/frameToStyle";
import { MYComponentProps } from "../types/ComponentProps";

const BASE_STYLES: React.CSSProperties = {
  display: "flex",
  position: "relative",
  width: "fit-content",
  height: "fit-content",
  pointerEvents: "auto",
  justifyContent: "center",
  alignItems: "center",
  isolation: "isolate",
};

const BaseViewRender = <K extends keyof HTMLElementTagNameMap = "div">(
  props: MYBaseViewProps<K>,
  ref: React.Ref<HTMLElementTagNameMap[K]>
) => {
  const { element, frame, dynamicStyle, children, renderContext } = props;
  const component = (element || "div") as string;

  const transitionStyle = renderContext?.animation
    ? { transition: `all ${renderContext.animation.duration}s ${renderContext.animation.timingCurve}` }
    : { transition: "none" };

  const f = { ...frame };
  f.alignment = undefined;
  const frameStyle = frameToStyle(f);

  const initialProps: any = {
    style: { ...BASE_STYLES, ...transitionStyle, ...frameStyle }
  };

  const finalProps: MYComponentProps<K> = { ...initialProps };

  if (dynamicStyle) {
    (Object.keys(dynamicStyle) as Array<keyof MYDynamicStyle<K>>).forEach((key) => {
      const updater = dynamicStyle[key];
      if (typeof updater === 'function') {
        finalProps[key] = updater(initialProps[key]);
      }
    });
  }

  if (renderContext?.allowsHitTesting === false) {
    finalProps.style = {
      ...finalProps.style,
      pointerEvents: "none",
    };
  }

  return React.createElement(
    component,
    { ref: ref, ...finalProps },
    children
  );
};

export const MYBaseView = React.forwardRef(BaseViewRender) as <K extends keyof HTMLElementTagNameMap = "div">(
  props: MYBaseViewProps<K> & { ref?: React.Ref<HTMLElementTagNameMap[K]> }
) => React.ReactElement | null;