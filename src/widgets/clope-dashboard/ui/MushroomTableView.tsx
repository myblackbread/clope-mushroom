import { ClusterInfo } from "@/src/entities/clope/model/ClusterInfo";
import {
    MYText,
    MYColor,
    MYRoundedRectangle,
    MYGrid,
    MYGridRow,
    MYView,
    MYForEach,
} from "@/src/shared/my-ui";
import { MYTableCellModifier } from "./TableCellModifier";
import { MushroomTableHeaderCell } from "./MushroomTableHeaderCell";

function enumerated<T>(array: T[]): { index: number; element: T }[] {
    return array.map((element, index) => ({ index, element }));
}

export class MushroomTableView extends MYView {
    constructor(private readonly clustersInfo: ClusterInfo[]) {
        super();
    }

    body(): MYView {
        // Шапка и её линия-разделитель (просто массив)
        const headerElements: MYView[] = [
            new MYGridRow([
                new MushroomTableHeaderCell("Размер"),
                new MushroomTableHeaderCell("🥗 Съедобные"),
                new MushroomTableHeaderCell("☠️ Ядовитые"),
                new MushroomTableHeaderCell("Чистота"),
                new MushroomTableHeaderCell("Доминанта"),
            ]),
            new MYColor("#e5e7eb").frame({ height: 1 })
        ];

        const dataRows = MYForEach(
            enumerated(this.clustersInfo),
            item => item.element.id,
            ({ index, element: cluster }) => {

                const isHighPurity = cluster.purity > 90;
                const purityColor = isHighPurity ? MYColor.rgb(6, 95, 70) : MYColor.rgb(153, 27, 27);
                const purityBg = isHighPurity ? MYColor.rgb(209, 250, 229) : MYColor.rgb(254, 226, 226);

                return [
                    new MYGridRow([
                        new MYText(cluster.size.toString())
                            .fontWeight("bold")
                            .modifier(new MYTableCellModifier()),

                        new MYText(cluster.edibleCount.toString())
                            .fontWeight("medium")
                            .foregroundStyle(MYColor.rgb(16, 185, 129))
                            .modifier(new MYTableCellModifier()),

                        new MYText(cluster.poisonousCount.toString())
                            .fontWeight("medium")
                            .foregroundStyle(MYColor.rgb(239, 68, 68))
                            .modifier(new MYTableCellModifier()),

                        new MYText(`${cluster.purity.toFixed(1)}%`)
                            .fontWeight("bold")
                            .foregroundStyle(purityColor)
                            .padding({ edges: "horizontal", length: 8 })
                            .padding({ edges: "vertical", length: 4 })
                            .background(purityBg)
                            .clipShape(new MYRoundedRectangle(6))
                            .modifier(new MYTableCellModifier()),

                        new MYText(cluster.dominantType)
                            .modifier(new MYTableCellModifier())
                    ]),
                    index < this.clustersInfo.length - 1 ? new MYColor("#f3f4f6").frame({ height: 1 }) : undefined
                ];
            }
        );

        return new MYGrid([...headerElements, ...dataRows], 0, 0)
            .background(MYColor.white)
            .clipShape(new MYRoundedRectangle(16));
    }
}