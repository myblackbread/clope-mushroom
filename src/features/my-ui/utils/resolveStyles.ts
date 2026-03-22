import React from "react";
import { MYFont, MYFontWeight } from "../types/Font";
import { MYForegroundStyle } from "../types/ForegroundStyle";

const weightMap: Record<MYFontWeight, React.CSSProperties["fontWeight"]> = {
  ultraLight: 100, thin: 200, light: 300, regular: 400,
  medium: 500, semibold: 600, bold: 700, heavy: 800, black: 900
};

const textStyleMap: Record<string, { fontSize: number; fontWeight: React.CSSProperties["fontWeight"] }> = {
  largeTitle: { fontSize: 34, fontWeight: 400 },
  title: { fontSize: 28, fontWeight: 400 },
  title2: { fontSize: 22, fontWeight: 400 },
  title3: { fontSize: 20, fontWeight: 400 },
  headline: { fontSize: 17, fontWeight: 600 },
  body: { fontSize: 17, fontWeight: 400 },
  callout: { fontSize: 16, fontWeight: 400 },
  subheadline: { fontSize: 15, fontWeight: 400 },
  footnote: { fontSize: 13, fontWeight: 400 },
  caption: { fontSize: 12, fontWeight: 400 },
  caption2: { fontSize: 11, fontWeight: 400 },
};

export function resolveFont(font?: MYFont, weightOverride?: MYFontWeight): React.CSSProperties {
  let style: React.CSSProperties = {};

  if (typeof font === "string" && textStyleMap[font]) {
    style = { ...textStyleMap[font] };
  } else if (typeof font === "object") {
    style.fontSize = font.size;
    if (font.weight) style.fontWeight = weightMap[font.weight];
    if (font.design === "monospaced") style.fontFamily = "monospace";
    if (font.design === "serif") style.fontFamily = "serif";
    if (font.design === "rounded") style.fontFamily = "system-ui, rounded";
  }

  if (weightOverride) {
    style.fontWeight = weightMap[weightOverride];
  }

  return style;
}

export function resolveForegroundStyle(style?: MYForegroundStyle): React.CSSProperties {
  if (!style) return {};

  if (style === "primary") return { opacity: 1 };
  if (style === "secondary") return { opacity: 0.6 };
  if (style === "tertiary") return { opacity: 0.3 };
  if (style === "quaternary") return { opacity: 0.15 };

  const colorValue = typeof style === "string" ? style : style.rawValue;
  return { color: colorValue };
}