
export type MYAnimation = {
  duration: number;
  timingCurve: string;
};

export const MYAnimations = {
  default: { duration: 0.3, timingCurve: "ease" } as MYAnimation,
  linear: (duration = 0.3): MYAnimation => ({ duration, timingCurve: "linear" }),
  easeInOut: (duration = 0.3): MYAnimation => ({ duration, timingCurve: "ease-in-out" }),
};