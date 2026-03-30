import MY from "@/src/shared/my-ui";
import { MYTableCellModifier } from "./TableCellModifier";

export class MushroomTableHeaderCell extends MY.View {
    constructor(private readonly text: string) {
        super();
    }

    body(): MY.View {
        return new MY.Text(this.text)
            .fontWeight("semibold")
            .foregroundStyle(MY.Color.rgb(107, 114, 128))
            .modifier(new MYTableCellModifier())
    }
}