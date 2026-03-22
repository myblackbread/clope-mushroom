"use client";
import React from "react";
import ClopeExample from "./examples/clope-mushrooms/page";
import { MYBaseView, MYButton, MYRoundedRectangle, MYText, MYVStack } from "@/src/features/my-ui";

export default function Test() {
  const [value, setValue] = React.useState(0)

  return (
    <MYBaseView dynamicStyle={{
      style: p => ({
        ...p,
        width: "100vw",
        height: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      })
    }}>
      <ClopeExample />
    </MYBaseView>
  );
}