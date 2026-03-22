import React from "react";

export type MYComponentProps<K extends keyof HTMLElementTagNameMap> =
  Omit<React.ComponentProps<K>, 'children'>;