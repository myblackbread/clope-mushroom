import MY from "@/src/shared/my-ui";
import { MushroomActionButton } from "./MushroomActionButton";
import { ArrowDownCircle } from "lucide-react";
import { MushroomViewModel } from "../model/MushroomViewModel";

export class MushroomControlForm extends MY.View {
    constructor(private readonly viewModel: MushroomViewModel) {
        super();
    }

    body(): MY.View {
        const isFetching = this.viewModel.isFetching.wrappedValue;
        const isCalculating = this.viewModel.isCalculating.wrappedValue;
        const isDataLoaded = this.viewModel.isDataLoaded.wrappedValue;
        const isPhaseOneCompleted = this.viewModel.isPhaseOneCompleted.wrappedValue;
        const currentProfit = this.viewModel.currentProfit.wrappedValue;
        const clustersCount = this.viewModel.clustersInfo.wrappedValue.length;
        const repulsion = this.viewModel.repulsion.wrappedValue;

        const isBusy = isFetching || isCalculating;
        const spacing = 16.0;

        return new MY.VStack([
            currentProfit !== null ? new MY.HStack([
                new MY.Text(`Профит: ${currentProfit.toFixed(3)}`).foregroundStyle("white"),
                new MY.Spacer(),
                new MY.Text(`Кластеров: ${clustersCount}`).foregroundStyle("white")
            ])
                .font("headline")
                .padding({ edges: "horizontal", length: 20 })
                .padding({ edges: "vertical", length: 16 })
                .background(MY.Color.rgb(16, 185, 129))
                .clipShape(new MY.RoundedRectangle(16))
                .animation() : undefined,

            new MY.VStack([
                new MY.VStack([
                    new MY.ZStack([
                        new MY.Text("REPULSION (Отталкивание)"),
                        new MY.HStack([
                            new MY.Spacer(),
                            new MY.Text(`${repulsion.toFixed(1)}`)
                        ])
                    ]),
                    new MY.Slider(this.viewModel.repulsion.projectedValue, [1.0, 4.0], 0.1)
                        .disabled(isBusy)
                        .onChange(repulsion, () => this.viewModel.resetClusteringState())
                ], 12),

                new MY.ZStack([
                    !isDataLoaded
                        ? new MushroomActionButton(
                            isFetching ? "Идет загрузка..." : "Скачать данные",
                            () => this.viewModel.loadData(),
                            MY.Color.rgb(59, 130, 246),
                            isFetching,
                            new MY.Image(<ArrowDownCircle size={20} />)
                        )
                        : new MY.HStack([
                            new MushroomActionButton("Фаза 1", () => this.viewModel.runPhaseOne(), MY.Color.rgb(31, 41, 55), isBusy),
                            new MY.Spacer(),
                            new MushroomActionButton("Фаза 2", () => this.viewModel.runPhaseTwo(), MY.Color.rgb(31, 41, 55), !isPhaseOneCompleted || isBusy)
                        ])
                ])
            ], spacing)
                .padding({ edges: "all", length: 24 })
                .background(MY.Color.white)
                .clipShape(new MY.RoundedRectangle(24))

        ], spacing)
            .animation();
    }
}