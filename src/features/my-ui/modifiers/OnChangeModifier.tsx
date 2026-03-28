import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { useLatestCallback } from "../hooks/useLatestCallback";
import { MYAnyView, MYView } from "../core/View";

interface MYOnChangeProps<T> {
  value: T;
  action: (oldValue: T, newValue: T) => void;
  initial?: boolean;
  children: React.ReactNode;
}

const MYOnChangeWrapper = <T,>({ value, action, initial = false, children }: MYOnChangeProps<T>) => {
  const stableAction = useLatestCallback(action);
  const prevRef = React.useRef<T>(value);
  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (initial) stableAction(value, value);
      return;
    }

    if (prevRef.current !== value) {
      const oldValue = prevRef.current;
      prevRef.current = value;
      stableAction(oldValue, value);
    }
  }, [value, initial, stableAction]);

  return children;
};

export class MYOnChangeModifier<T> implements MYViewModifier {
  constructor(
    private readonly value: T,
    private readonly action: (oldValue: T, newValue: T) => void,
    private readonly initial: boolean = false
  ) { }

  body(content: MYView): MYView {
    return new MYAnyView((parentFrame) => (
      <MYOnChangeWrapper
        value={this.value}
        action={this.action}
        initial={this.initial}
      >
        {content.makeView(parentFrame)}
      </MYOnChangeWrapper>
    ));
  }
}