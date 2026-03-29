import { MYColor, MYVStack, MYZStack, MYSpacer, MYGeometryReader, MYSize, MYAnyView, MYBinding, MYText } from "@/src/shared/my-ui";
import React from "react";

import { useMushroomViewModel } from "@/src/features/clope-clustering/model/useMushroomViewModel";
import { MushroomTableView } from "./MushroomTableView";
import { ExpandablePanel } from "@/src/widgets/clope-dashboard/ui/ExpandablePanel";
import { MushroomControlForm } from "@/src/features/clope-clustering/ui/MushroomControlForm";
import { MYWindow } from "@/src/shared/my-ui/core/Window";

export function ClopeDashboard() {
    const viewModel = useMushroomViewModel();
    const [size, setSize] = React.useState<MYSize>({ width: 0, height: 0 });
    const [isPanelExpanded, setIsPanelExpanded] = React.useState(true);

    const clopeView = new MYWindow(
        new MYZStack([
            MYColor.rgb(244, 244, 245),
            viewModel.clustersInfo.length > 0 ? (
                new MushroomTableView(viewModel.clustersInfo)
                    .frame({ maxWidth: Infinity })
                    .padding({ edges: "bottom", length: size.height })
                    .padding(24)
            ) : (
                new MYText(
                    viewModel.isDataLoaded && !viewModel.isFetching
                        ? "Данные загружены. Запустите Фазу 1."
                        : "Нет данных для отображения"
                )
                    .font({ size: 18 })
                    .fontWeight("medium")
                    .foregroundStyle(MYColor.rgb(156, 163, 175))
                    .padding({ edges: "top", length: 60 })
                    .frame({ maxWidth: Infinity, maxHeight: Infinity })
            ),
        ]),
        new MYVStack([
            new MYSpacer(),
            new ExpandablePanel(
                new MYBinding(() => isPanelExpanded, setIsPanelExpanded),
                new MushroomControlForm(viewModel)
                    .padding({ edges: "horizontal", length: 16 })
            )
                .padding({ edges: "bottom", length: 24 })
                .background(new MYGeometryReader((proxy) => {
                    return MYColor.clear.onChange(proxy.size, (_, newValue) => setSize(newValue));
                }))
        ], 0)
            .frame({ maxWidth: 480 })
    );

    return clopeView.render();
}