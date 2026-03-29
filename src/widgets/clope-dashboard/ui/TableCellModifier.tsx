import { MYViewModifier, MYView } from "@/src/shared/my-ui";

export class MYTableCellModifier implements MYViewModifier {
    body(content: MYView): MYView {
        return content
            .frame({ maxWidth: Infinity, alignment: "left" })
            .padding({ edges: "horizontal", length: 20 })
            .padding({ edges: "vertical", length: 16 });
    }
}