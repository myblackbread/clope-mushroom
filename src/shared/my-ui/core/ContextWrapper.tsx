import React from "react";
import { MYRenderContextReact } from "../context/RenderContextReact";
import { MYRenderContext } from "../types/RenderContext";

export const MYContextWrapper: React.FC<{
    transform: (prev?: MYRenderContext) => MYRenderContext;
    children: React.ReactNode;
}> = ({ transform, children }) => {
    const parentContext = React.useContext(MYRenderContextReact);
    const newContext = transform({ ...parentContext });

    return (
        <MYRenderContextReact.Provider value={newContext}>
            {children}
        </MYRenderContextReact.Provider>
    );
};