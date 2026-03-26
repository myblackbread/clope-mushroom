import { MYButton, MYText, MYCapsule, MYColor, MYView, MYZStack } from "@/src/features/my-ui";

export function MushroomActionButton(
    text: string,
    action: () => void,
    backgroundColor: MYColor,
    disabled: boolean = false,
    iconView?: MYView
): MYView {
    let labelContent: MYView;

    if (iconView) {
        labelContent = new MYZStack([
            iconView,
            new MYText(text).font("headline")
                .frame({ maxWidth: Infinity }),
        ], "left");
    } else {
        labelContent = new MYText(text).font("headline");
    }

    return new MYButton(
        action,
        labelContent
            .padding({ edges: "horizontal", length: 24 })
            .padding({ edges: "vertical", length: 14 })
            .background(backgroundColor)
            .foregroundStyle("white")
    )
        .clipShape(new MYCapsule())
        .disabled(disabled);
}