import { MYDynamicStyle } from "./DynamicStyle";
import { MYRenderContext } from "./RenderContext";
import { MYFrame } from "./Frame";

export interface MYBaseViewProps<K extends keyof HTMLElementTagNameMap = "div"> {
  element?: K;
  dynamicStyle?: MYDynamicStyle<K>;
  children?: React.ReactNode;
  renderContext?: MYRenderContext;
  frame?: MYFrame;
}