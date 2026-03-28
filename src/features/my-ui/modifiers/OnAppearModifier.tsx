import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { useLatestCallback } from "../hooks/useLatestCallback";
import { MYAnyView, MYView } from "../core/View";

const MYOnAppearWrapper: React.FC<{ action: () => void, children: React.ReactNode }> = ({ action, children }) => {
  const stableAction = useLatestCallback(action);

  React.useEffect(() => {
    stableAction();
  }, [stableAction]);

  return children;
};

export class MYOnAppearModifier implements MYViewModifier {
  constructor(private action: () => void) { }

  body(content: MYView): MYView {
    return new MYAnyView((parentFrame) => (
      <MYOnAppearWrapper action={this.action}>
        {content.makeView(parentFrame)}
      </MYOnAppearWrapper>
    ));
  }
}