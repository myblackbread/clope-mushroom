import React from "react";
import { MYView } from "../core/View";
import { MYBaseView } from "./BaseView";

export class MYSpacer extends MYView {
  constructor(private readonly minLength?: number) {
    super();
  }

  makeView(): React.ReactNode {
    return (
      <MYBaseView
        dynamicStyle={{
          style: (prev) => ({
            ...prev,
            width: "auto",
            height: "auto",
            flexGrow: 1,
            flexShrink: 0,
            flexBasis: this.minLength ?? 0,
            pointerEvents: "none",
            alignSelf: "stretch"
          })
        }}
      />
    );
  }

  get isSpacer(): boolean {
    return true;
  }
}