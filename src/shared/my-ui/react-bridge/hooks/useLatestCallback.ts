import React from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function useLatestCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = React.useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return React.useCallback(((...args) => {
    return callbackRef.current(...args);
  }) as T, []);
}