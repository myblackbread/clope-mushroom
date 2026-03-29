import { MYShape } from "../Shape";
import { MYCornerRadiusOrSize } from "./Types/CornerRadiusOrSize";
import { MYRoundedRectangleStyle } from "./Types/ShapeStyle";
import { MYSize } from "../../types/Size";


export class MYRoundedRectangle extends MYShape {
  constructor(
    private cornerRadiusOrSize: MYCornerRadiusOrSize,
    private style: MYRoundedRectangleStyle = "circular"
  ) {
    super();
    this.cornerRadiusOrSize = cornerRadiusOrSize;
    this.style = style;
  }

  path(container: MYSize): string {
    const [w, h, rx, ry] = this.computeRadii(container);

    return this.style === "circular"
      ? this.circularPath(w, h, rx, ry)
      : this.continuousPath(w, h, rx, ry);
  }

  private computeRadii(container: MYSize): [number, number, number, number] {
    let w = container.width;
    let h = container.height;
    let rx = 0;
    let ry = 0;
    
    if (typeof this.cornerRadiusOrSize === "number") {
      rx = ry = this.cornerRadiusOrSize;
    } else {
      rx = this.cornerRadiusOrSize.width;
      ry = this.cornerRadiusOrSize.height;
    }

    rx = Math.min(rx, w / 2);
    ry = Math.min(ry, h / 2);

    return [w, h, rx, ry];
  }

  private circularPath(w: number, h: number, rx: number, ry: number): string {
    return [
      `M ${rx},0`,
      `H ${w - rx}`,
      `A ${rx},${ry} 0 0 1 ${w},${ry}`,
      `V ${h - ry}`,
      `A ${rx},${ry} 0 0 1 ${w - rx},${h}`,
      `H ${rx}`,
      `A ${rx},${ry} 0 0 1 0,${h - ry}`,
      `V ${ry}`,
      `A ${rx},${ry} 0 0 1 ${rx},0`,
      `Z`,
    ].join(" ");
  }

  private continuousPath(w: number, h: number, rx: number, ry: number): string {
    const k = 0.551915024494;
    const cx = rx * k;
    const cy = ry * k;

    return [
      `M ${rx},0`,
      `H ${w - rx}`,
      `C ${w - rx + cx},0 ${w},${ry - cy} ${w},${ry}`,
      `V ${h - ry}`,
      `C ${w},${h - ry + cy} ${w - rx + cx},${h} ${w - rx},${h}`,
      `H ${rx}`,
      `C ${rx - cx},${h} 0,${h - ry + cy} 0,${h - ry}`,
      `V ${ry}`,
      `C 0,${ry - cy} ${rx - cx},0 ${rx},0`,
      `Z`,
    ].join(" ");
  }
}