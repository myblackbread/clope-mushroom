import {
    MYColor,
    MYHStack,
    MYRoundedRectangle,
    MYText,
    MYVStack,
    MYZStack,
    RenderMYView,
    MYSpacer,
    MYSlider,
    MYGeometryReader,
    MYSize,
    MYAnyView,
    MYScrollView,
    MYImage,
    MYCapsule,
    MYButton,
} from "@/src/features/my-ui"
import { ArrowDownCircle } from "lucide-react";
import React from "react";

import { useMushroomViewModel } from "@/src/shared/clope-mushrooms/hooks/useMushroomViewModel";
import { MushroomTableView } from "@/src/shared/clope-mushrooms/ui/MushroomTableView";
import { MushroomActionButton } from "@/src/shared/clope-mushrooms/ui/MushroomActionButton";

export default function ClopeExample() {
    const viewModel = useMushroomViewModel();
    const spacing = 16.0;
    const [size, setSize] = React.useState<MYSize>({ width: 0, height: 0 });
    const [isPanelExpanded, setIsPanelExpanded] = React.useState(true);

    const isBusy = viewModel.isFetching || viewModel.isCalculating;

    const clopeView = new MYZStack([
        MYColor.rgb(244, 244, 245),

        // 1. Таблица
        new MYScrollView(
            new MYAnyView(
                <MushroomTableView
                    clustersInfo={viewModel.clustersInfo}
                    isDataLoaded={viewModel.isDataLoaded}
                    isFetching={viewModel.isFetching}
                    bottomPadding={size.height ? size.height + 24 : 180}
                />
            ),
            ["horizontal", "vertical"]
        ),

        // 2. Панель управления
        new MYVStack([
            new MYSpacer(),
            new MYVStack([

                new MYButton(
                    () => setIsPanelExpanded(!isPanelExpanded),
                    MYColor.rgb(209, 213, 219)
                        .frame({
                            width: isPanelExpanded ? 40 : 60,
                            height: isPanelExpanded ? 5 : 8
                        })
                        .animation()
                )
                    .clipShape(new MYCapsule())
                    .padding({ edges: "bottom", length: 8 }),

                isPanelExpanded && new MYVStack([
                    // Плашка с профитом
                    viewModel.currentProfit != null && new MYHStack([
                        new MYText(`Профит: ${viewModel.currentProfit.toFixed(3)}`).foregroundStyle("white"),
                        new MYSpacer(),
                        new MYText(`Кластеров: ${viewModel.clustersInfo.length}`).foregroundStyle("white")
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
                                    new MYText(`${viewModel.repulsion.wrappedValue.toFixed(1)}`)
                                        .font("headline")
                                        .frame({ alignment: "right" })
                                ])
                            ]),
                            new MYSlider(viewModel.repulsion, [1.0, 4.0], 0.1)
                                .disabled(isBusy)
                        ], 12),

                        new MYZStack([
                            !viewModel.isDataLoaded
                                ? MushroomActionButton(
                                    viewModel.isFetching ? "Идет загрузка..." : "Скачать данные",
                                    () => viewModel.loadData(),
                                    MYColor.rgb(59, 130, 246),
                                    viewModel.isFetching,
                                    new MYImage(<ArrowDownCircle size={20} />)
                                )
                                : new MYHStack([
                                    MushroomActionButton(
                                        "Фаза 1",
                                        () => viewModel.runPhaseOne(),
                                        MYColor.rgb(31, 41, 55),
                                        isBusy
                                    ),
                                    new MYSpacer(),
                                    MushroomActionButton(
                                        "Фаза 2",
                                        () => viewModel.runPhaseTwo(),
                                        MYColor.rgb(31, 41, 55),
                                        !viewModel.isPhaseOneCompleted || isBusy
                                    )
                                ])
                        ])
                    ], spacing)
                        .padding({ edges: "all", length: 24 })
                        .background(MYColor.white)
                        .clipShape(new MYRoundedRectangle(24))
                ], spacing)
                    .animation()
            ], 0)
                .padding({ edges: "horizontal", length: 16 })
                .padding({ edges: "bottom", length: 24 })
                .background(new MYGeometryReader((proxy) => {
                    return MYColor.clear.onChange(proxy.size, (_, newValue) => setSize(newValue));
                })),
        ], 0)
            .frame({ maxWidth: 480, maxHeight: Infinity }),
    ])

    return <RenderMYView view={clopeView} />;
}