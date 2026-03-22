import { MYShape } from "./Shape";
import { MYSize } from "../types/Size";

export class MYCapsule extends MYShape {
  path(container: MYSize): string {
    const w = container.width;
    const h = container.height;

    const r = Math.min(w / 2, h / 2);

    return [
      `M ${r},0`,
      `H ${w - r}`,
      `A ${r},${r} 0 0 1 ${w},${r}`,
      `V ${h - r}`,
      `A ${r},${r} 0 0 1 ${w - r},${h}`,
      `H ${r}`,
      `A ${r},${r} 0 0 1 0,${h - r}`,
      `V ${r}`,
      `A ${r},${r} 0 0 1 ${r},0`,
      `Z`,
    ].join(" ");
  }
}