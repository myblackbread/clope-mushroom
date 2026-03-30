import React from "react";

export const MYHierarchyContext = React.createContext<{ isRoot: boolean }>({
  isRoot: true,
});