import MY from "@/src/shared/my-ui";

export class MushroomActionButton extends MY.View {
    constructor(
        private readonly text1: string,
        private readonly action: () => void,
        private readonly backgroundColor: MY.Color,
        private readonly disabled1: boolean = false,
        private readonly iconView?: MY.View
    ) {
        super()
    }

    body(frame?: MY.Frame): MY.View {
        let labelContent: MY.View;

        if (this.iconView) {
            labelContent = new MY.ZStack([
                this.iconView,
                new MY.Text(this.text1).font("headline")
                    .frame({ maxWidth: Infinity }),
            ], "left");
        } else {
            labelContent = new MY.Text(this.text1).font("headline");
        }

        return new MY.Button(
            this.action,
            labelContent
                .padding({ edges: "horizontal", length: 24 })
                .padding({ edges: "vertical", length: 14 })
                .background(this.backgroundColor)
                .foregroundStyle("white")
        )
            .clipShape(new MY.Capsule())
            .disabled(this.disabled1);
    }
}