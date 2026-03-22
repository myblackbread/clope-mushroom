import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { useLatestCallback } from "../hooks/useLatestCallback";

const MYOnAppearWrapper: React.FC<{ action: () => void, children: React.ReactNode }> = ({ action, children }) => {
  const stableAction = useLatestCallback(action);

  React.useEffect(() => {
    stableAction();
  }, [stableAction]);

  return children;
};

export class MYOnAppearModifier implements MYViewModifier {
  constructor(private action: () => void) { }

  body(content: React.ReactNode): React.ReactNode {
    return <MYOnAppearWrapper action={this.action}>{content}</MYOnAppearWrapper>;
  }
}
