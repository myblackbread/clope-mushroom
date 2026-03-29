import { MYView, MYText, MYColor } from "@/src/shared/my-ui";
import { MYTableCellModifier } from "./TableCellModifier";

export class MushroomTableHeaderCell extends MYView {
    constructor(private readonly text: string) {
        super();
    }

    body(): MYView {
        return new MYText(this.text)
            .fontWeight("semibold")
            .foregroundStyle(MYColor.rgb(107, 114, 128))
            .modifier(new MYTableCellModifier())
            .background(MYColor.rgb(249, 250, 251)); 
    }
}