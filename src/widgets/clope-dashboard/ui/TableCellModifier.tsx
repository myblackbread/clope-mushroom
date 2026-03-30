import MY from "@/src/shared/my-ui";

export class MYTableCellModifier implements MY.ViewModifier {
    body(content: MY.View): MY.View {
        return content
            .frame({ maxWidth: Infinity, alignment: "left" })
            .padding({ edges: "horizontal", length: 20 })
            .padding({ edges: "vertical", length: 16 });
    }
}