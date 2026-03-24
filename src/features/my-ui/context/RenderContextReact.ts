import React from "react";
import { MYRenderContext } from "../types/RenderContext";

export const MYRenderContextReact = React.createContext<MYRenderContext>({});

export const useMYRenderContext = () => React.useContext(MYRenderContextReact);