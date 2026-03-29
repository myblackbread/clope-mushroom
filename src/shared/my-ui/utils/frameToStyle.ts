import React from "react";
import { MYFrame } from "../types/Frame";

function normalizeDimension(value?: number | string): number | string | undefined {
    if (value === undefined) return undefined;
    if (typeof value === "number") return isFinite(value) ? value : undefined;

    const trimmed = value.trim();
    if (!trimmed.endsWith("%")) return undefined;
    if (!/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(trimmed.slice(0, -1).trim())) return undefined;

    const num = parseFloat(trimmed);
    return isFinite(num) ? `${num}%` : undefined;
}

export function frameToStyle(frame?: MYFrame): React.CSSProperties {
    if (!frame) return {};

    const { alignment, ...dimensions } = frame;

    const sizeStyle: React.CSSProperties = Object.fromEntries(
        Object.entries(dimensions)
            .map(([key, value]) => [key, normalizeDimension(value as string | number)])
            .filter(([key, normalized]) => normalized !== undefined)
    );

    const isFullWidth = dimensions.maxWidth === Infinity;
    const isFullHeight = dimensions.maxHeight === Infinity;

    return {
        ...sizeStyle,

        ...(isFullWidth ? {
            width: "100%",
        } : {}),

        ...(isFullHeight ? {
            height: "100%",
        } : {}),

        ...(isFullWidth ? { maxWidth: undefined } : {}),
        ...(isFullHeight ? { maxHeight: undefined } : {}),
    };
}