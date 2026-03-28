import { MYButton, MYText, MYCapsule, MYColor, MYView, MYZStack, MYFrame } from "@/src/features/my-ui";

export class MushroomActionButton extends MYView {
    constructor(
        private readonly text1: string,
        private readonly action: () => void,
        private readonly backgroundColor: MYColor,
        private readonly disabled1: boolean = false,
        private readonly iconView?: MYView
    ) {
        super()
    }

    body(frame?: MYFrame): MYView {
        let labelContent: MYView;

        if (this.iconView) {
            labelContent = new MYZStack([
                this.iconView,
                new MYText(this.text1).font("headline")
                    .frame({ maxWidth: Infinity }),
            ], "left");
        } else {
            labelContent = new MYText(this.text1).font("headline");
        }

        return new MYButton(
            this.action,
            labelContent
                .padding({ edges: "horizontal", length: 24 })
                .padding({ edges: "vertical", length: 14 })
                .background(this.backgroundColor)
                .foregroundStyle("white")
        )
            .clipShape(new MYCapsule())
            .disabled(this.disabled1);
    }
}