
import { MYAnimation } from "./Animation";
import { MYFont, MYFontWeight } from "./Font";
import { MYForegroundStyle } from "./ForegroundStyle";

export interface MYRenderContext {
    animation?: MYAnimation;
    allowsHitTesting?: boolean;
    font?: MYFont;
    fontWeight?: MYFontWeight;
    foregroundStyle?: MYForegroundStyle;
    disabled?: boolean;
}