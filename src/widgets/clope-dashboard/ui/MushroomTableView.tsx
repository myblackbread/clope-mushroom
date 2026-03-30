import { ClusterInfo } from "@/src/entities/clope/model/ClusterInfo";
import MY from "@/src/shared/my-ui";
import { MYTableCellModifier } from "./TableCellModifier";
import { MushroomTableHeaderCell } from "./MushroomTableHeaderCell";

function enumerated<T>(array: T[]): { index: number; element: T }[] {
    return array.map((element, index) => ({ index, element }));
}

export class MushroomTableView extends MY.View {
    constructor(private readonly clustersInfo: ClusterInfo[]) {
        super();
    }

    body(): MY.View {
        const headerElements: MY.View[] = [
            new MY.GridRow([
                new MushroomTableHeaderCell("Размер"),
                new MushroomTableHeaderCell("🥗 Съедобные"),
                new MushroomTableHeaderCell("☠️ Ядовитые"),
                new MushroomTableHeaderCell("Чистота"),
                new MushroomTableHeaderCell("Доминанта"),
            ]),
            new MY.Color("#e5e7eb").frame({ height: 1 })
        ];

        const dataRows = MY.ForEach(
            enumerated(this.clustersInfo),
            item => item.element.id,
            ({ index, element: cluster }) => {

                const isHighPurity = cluster.purity > 90;
                const purityColor = isHighPurity ? MY.Color.rgb(6, 95, 70) : MY.Color.rgb(153, 27, 27);
                const purityBg = isHighPurity ? MY.Color.rgb(209, 250, 229) : MY.Color.rgb(254, 226, 226);

                return [
                    new MY.GridRow([
                        new MY.Text(cluster.size.toString())
                            .fontWeight("bold")
                            .modifier(new MYTableCellModifier()),

                        new MY.Text(cluster.edibleCount.toString())
                            .fontWeight("medium")
                            .foregroundStyle(MY.Color.rgb(16, 185, 129))
                            .modifier(new MYTableCellModifier()),

                        new MY.Text(cluster.poisonousCount.toString())
                            .fontWeight("medium")
                            .foregroundStyle(MY.Color.rgb(239, 68, 68))
                            .modifier(new MYTableCellModifier()),

                        new MY.Text(`${cluster.purity.toFixed(1)}%`)
                            .fontWeight("bold")
                            .foregroundStyle(purityColor)
                            .padding({ edges: "horizontal", length: 8 })
                            .padding({ edges: "vertical", length: 4 })
                            .background(purityBg)
                            .clipShape(new MY.RoundedRectangle(6))
                            .modifier(new MYTableCellModifier()),

                        new MY.Text(cluster.dominantType)
                            .modifier(new MYTableCellModifier())
                    ]),
                    index < this.clustersInfo.length - 1 ? new MY.Color("#f3f4f6").frame({ height: 1 }) : undefined
                ];
            }
        );

        return new MY.Grid([...headerElements, ...dataRows], 0, 0)
            .background(MY.Color.white)
            .clipShape(new MY.RoundedRectangle(16));
    }
}