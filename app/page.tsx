"use client";

import React from "react";
import { RenderMYView } from "@/src/shared/my-ui";
import { ClopeDashboard } from "@/src/widgets/clope-dashboard";

export default function Test() {
    const dashboard = React.useMemo(() => new ClopeDashboard(), []);

    return <RenderMYView view={dashboard} />;
}