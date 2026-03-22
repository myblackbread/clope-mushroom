import React from "react";
import { MYViewModifier } from "../core/ViewModifier";
import { useLatestCallback } from "../hooks/useLatestCallback";

const MYOnDisappearWrapper: React.FC<{ action: () => void, children: React.ReactNode }> = ({ action, children }) => {
  const stableAction = useLatestCallback(action);

  React.useEffect(() => {
    return () => {
      stableAction();
    };
  }, [stableAction]);

  return children;
};

export class MYOnDisappearModifier implements MYViewModifier {
  constructor(private action: () => void) { }

  body(content: React.ReactNode): React.ReactNode {
    return <MYOnDisappearWrapper action={this.action}>{content}</MYOnDisappearWrapper>;
  }
}