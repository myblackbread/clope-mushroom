
export type MYSize = { width: number, height: number };

export function isSize(value: unknown): value is MYSize {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    "width" in obj &&
    "height" in obj &&
    typeof obj.width === "number" &&
    typeof obj.height === "number"
  );
}