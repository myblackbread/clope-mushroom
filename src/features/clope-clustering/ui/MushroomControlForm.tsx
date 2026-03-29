import { MYView, MYVStack, MYHStack, MYZStack, MYText, MYSpacer, MYSlider, MYColor, MYRoundedRectangle, MYImage, MYFrame } from "@/src/shared/my-ui";
import { ArrowDownCircle } from "lucide-react";
import { MushroomActionButton } from "./MushroomActionButton";

export class MushroomControlForm extends MYView {
    constructor(private readonly viewModel: any) {
        super();
    }

    body(): MYView {
        const isBusy =  this.viewModel.isFetching || this.viewModel.isCalculating;
        const spacing = 16.0;

        return new MYVStack([
            // Плашка с профитом
            this.viewModel.currentProfit && new MYHStack([
                new MYText(`Профит: ${this.viewModel.currentProfit.toFixed(3)}`).foregroundStyle("white"),
                new MYSpacer(),
                new MYText(`Кластеров: ${this.viewModel.clustersInfo.length}`).foregroundStyle("white")
            ])
                .font("headline")
                .padding({ edges: "horizontal", length: 20 })
                .padding({ edges: "vertical", length: 16 })
                .background(MYColor.rgb(16, 185, 129))
                .clipShape(new MYRoundedRectangle(16))
                .animation(),

            // Блок с ползунком и кнопками
            new MYVStack([
                new MYVStack([
                    new MYZStack([
                        new MYText("REPULSION (Отталкивание)")
                            .font("subheadline")
                            .foregroundStyle(MYColor.rgb(107, 114, 128)),
                        new MYHStack([
                            new MYSpacer(),
                            new MYText(`${this.viewModel.repulsion.wrappedValue.toFixed(1)}`)
                                .font("headline")
                                .frame({ alignment: "right" })
                        ])
                    ]),
                    new MYSlider(this.viewModel.repulsion, [1.0, 4.0], 0.1)
                        .disabled(isBusy)
                ], 12),

                new MYZStack([
                    !this.viewModel.isDataLoaded
                        ? new MushroomActionButton(
                            this.viewModel.isFetching ? "Идет загрузка..." : "Скачать данные",
                            () => this.viewModel.loadData(),
                            MYColor.rgb(59, 130, 246),
                            this.viewModel.isFetching,
                            new MYImage(<ArrowDownCircle size={20} />)
                        )
                        : new MYHStack([
                            new MushroomActionButton(
                                "Фаза 1",
                                () => this.viewModel.runPhaseOne(),
                                MYColor.rgb(31, 41, 55),
                                isBusy
                            ),
                            new MYSpacer(),
                            new MushroomActionButton(
                                "Фаза 2",
                                () => this.viewModel.runPhaseTwo(),
                                MYColor.rgb(31, 41, 55),
                                !this.viewModel.isPhaseOneCompleted || isBusy
                            )
                        ])
                ])
            ], spacing)
            .padding({ edges: "all", length: 24 })
            .background(MYColor.white)
            .clipShape(new MYRoundedRectangle(24))
        ], spacing)
            .animation();
    }
}