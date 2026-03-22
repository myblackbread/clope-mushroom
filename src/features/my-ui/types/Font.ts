export type MYFontWeight =
  | "ultraLight" | "thin" | "light" | "regular"
  | "medium" | "semibold" | "bold" | "heavy" | "black";

export type MYFontDesign = "default" | "serif" | "rounded" | "monospaced";

export type MYTextStyle =
  | "largeTitle" | "title" | "title2" | "title3"
  | "headline" | "subheadline" | "body"
  | "callout" | "footnote" | "caption" | "caption2";

export type MYFont =
  | MYTextStyle
  | { size: number; weight?: MYFontWeight; design?: MYFontDesign };