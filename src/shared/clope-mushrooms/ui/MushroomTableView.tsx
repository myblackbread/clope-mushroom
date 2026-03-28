import React from "react";
import { ClusterInfo } from "../models/ClusterInfo";
import { MYText, MYColor, MYRoundedRectangle } from "@/src/features/my-ui";

interface MushroomTableViewProps {
    clustersInfo: ClusterInfo[];
    isDataLoaded: boolean;
    isFetching: boolean;
    bottomPadding: number;
}

export const MushroomTableView: React.FC<MushroomTableViewProps> = ({
    clustersInfo,
    isDataLoaded,
    isFetching,
    bottomPadding
}) => {
    const renderHeader = (text: string) =>
        new MYText(text)
            .fontWeight("semibold")
            .foregroundStyle(MYColor.rgb(107, 114, 128))
            .makeView();

    const cellStyle: React.CSSProperties = { padding: "16px 20px", borderBottom: "1px solid #f3f4f6" };
    const headerStyle: React.CSSProperties = { padding: "16px 20px", textAlign: "left" };

    return (
        <div style={{
            width: "100%",
            padding: "24px",
            paddingBottom: bottomPadding,
            boxSizing: "border-box",
        }}>
            {clustersInfo.length > 0 ? (
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}>
                    <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        <tr>
                            <th style={headerStyle}>{renderHeader("Размер")}</th>
                            <th style={headerStyle}>{renderHeader("Съедобные 🥗")}</th>
                            <th style={headerStyle}>{renderHeader("Ядовитые ☠️")}</th>
                            <th style={headerStyle}>{renderHeader("Чистота")}</th>
                            <th style={headerStyle}>{renderHeader("Доминанта")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clustersInfo.map((cluster) => (
                            <tr key={cluster.id}>
                                <td style={cellStyle}>
                                    {new MYText(cluster.size.toString())
                                        .fontWeight("bold")
                                        .makeView()}
                                </td>
                                <td style={cellStyle}>
                                    {new MYText(cluster.edibleCount.toString())
                                        .fontWeight("medium")
                                        .foregroundStyle(MYColor.rgb(16, 185, 129))
                                        .makeView()}
                                </td>
                                <td style={cellStyle}>
                                    {new MYText(cluster.poisonousCount.toString())
                                        .fontWeight("medium")
                                        .foregroundStyle(MYColor.rgb(239, 68, 68))
                                        .makeView()}
                                </td>
                                <td style={cellStyle}>
                                    {new MYText(`${cluster.purity.toFixed(1)}%`)
                                        .fontWeight("bold")
                                        .foregroundStyle(cluster.purity > 90 ? MYColor.rgb(6, 95, 70) : MYColor.rgb(153, 27, 27))
                                        .padding({ edges: "horizontal", length: 8 })
                                        .padding({ edges: "vertical", length: 4 })
                                        .background(cluster.purity > 90 ? MYColor.rgb(209, 250, 229) : MYColor.rgb(254, 226, 226))
                                        .clipShape(new MYRoundedRectangle(6))
                                        .makeView()}
                                </td>
                                <td style={cellStyle}>
                                    {new MYText(cluster.dominantType).makeView()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                new MYText(isDataLoaded && !isFetching
                    ? "Данные загружены. Запустите Фазу 1."
                    : "Нет данных для отображения")
                    .font({ size: 18 })
                    .fontWeight("medium")
                    .foregroundStyle(MYColor.rgb(156, 163, 175))
                    .padding({ edges: "top", length: 60 })
                    .frame({ maxWidth: Infinity, maxHeight: Infinity })
                    .makeView()
            )}
        </div>
    );
};