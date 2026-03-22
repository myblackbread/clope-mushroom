import { MYButton, MYText, MYCapsule, MYColor, MYView, MYHStack, MYSpacer } from "@/src/features/my-ui";

export function MushroomActionButton(
    text: string,
    action: () => void,
    backgroundColor: MYColor,
    disabled: boolean = false,
    iconView?: MYView
): MYView {
    let labelContent: MYView;

    if (iconView) {
        labelContent = new MYHStack([
            iconView,
            new MYSpacer(8),
            new MYText(text).font("headline"),
        ]);
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