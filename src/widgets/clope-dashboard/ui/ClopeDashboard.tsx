import MY from "@/src/shared/my-ui";
import { MushroomViewModel } from "@/src/features/clope-clustering/model/MushroomViewModel";
import { MushroomTableView } from "./MushroomTableView";
import { ExpandablePanel } from "./ExpandablePanel";
import { MushroomControlForm } from "@/src/features/clope-clustering/ui/MushroomControlForm";

export class ClopeDashboard extends MY.View {
    private readonly viewModel = new MushroomViewModel();
    private readonly size = new MY.State<MY.Size>({ width: 0, height: 0 });
    private readonly isPanelExpanded = new MY.State(true);

    body(): MY.View {
        const clusters = this.viewModel.clustersInfo.wrappedValue;
        const currentSize = this.size.wrappedValue;
        const isLoaded = this.viewModel.isDataLoaded.wrappedValue;
        const isFetching = this.viewModel.isFetching.wrappedValue;

        const mainContent = new MY.ZStack([
            MY.Color.rgb(244, 244, 245),
            clusters.length > 0 ? (
                new MushroomTableView(clusters)
                    .padding({ edges: "bottom", length: currentSize.height })
                    .padding(24)
            ) : (
                new MY.Text(
                    isLoaded && !isFetching
                        ? "Данные загружены. Запустите Фазу 1."
                        : "Нет данных для отображения"
                )
                    .font({ size: 18 })
                    .fontWeight("medium")
                    .foregroundStyle(MY.Color.rgb(156, 163, 175))
                    .padding({ edges: "top", length: 60 })
            ),
        ]);

        const hudLayer = new MY.VStack([
            new MY.Spacer(),
            new ExpandablePanel(
                this.isPanelExpanded.projectedValue,
                new MushroomControlForm(this.viewModel)
                    .padding({ edges: "horizontal", length: 16 })
            )
                .padding({ edges: "bottom", length: 24 })
                .background(new MY.GeometryReader((proxy) => {
                    return MY.Color.clear.onChange(proxy.size, (_, newValue) => {
                        this.size.wrappedValue = newValue;
                    });
                }))
        ], 0).frame({ maxWidth: 480 });

        return new MY.AnyView(() => new MY.Window(mainContent, hudLayer).render())
            .onDisappear(() => this.viewModel.dispose());
    }
}