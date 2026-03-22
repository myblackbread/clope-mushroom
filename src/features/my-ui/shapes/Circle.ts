import { MYShape } from "./Shape";
import { MYSize } from "../types/Size";

export class MYCircle extends MYShape {
  path(container: MYSize): string {
    const w = container.width;
    const h = container.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2;

    return [
      `M ${cx},${cy - r}`,
      `A ${r},${r} 0 1,0 ${cx},${cy + r}`,
      `A ${r},${r} 0 1,0 ${cx},${cy - r}`,
      `Z`
    ].join(" ");
  }
}