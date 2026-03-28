import { MYColor, MYVStack, MYZStack, MYSpacer, MYGeometryReader, MYSize, MYAnyView, MYBinding } from "@/src/features/my-ui";
import React from "react";

import { useMushroomViewModel } from "@/src/shared/clope-mushrooms/hooks/useMushroomViewModel";
import { MushroomTableView } from "@/src/shared/clope-mushrooms/ui/MushroomTableView";
import { ExpandablePanel } from "@/src/shared/clope-mushrooms/ui/ExpandablePanel";
import { MushroomControlForm } from "@/src/shared/clope-mushrooms/ui/MushroomControlForm";
import { MYWindow } from "@/src/features/my-ui/core/Window";

export default function ClopeExample() {
    const viewModel = useMushroomViewModel();
    const [size, setSize] = React.useState<MYSize>({ width: 0, height: 0 });
    const [isPanelExpanded, setIsPanelExpanded] = React.useState(true);

    const clopeView = new MYWindow(
        new MYZStack([
            MYColor.rgb(244, 244, 245),
            new MYAnyView(
                <MushroomTableView
                    clustersInfo={viewModel.clustersInfo}
                    isDataLoaded={viewModel.isDataLoaded}
                    isFetching={viewModel.isFetching}
                    bottomPadding={size.height ? size.height + 24 : 180}
                />
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