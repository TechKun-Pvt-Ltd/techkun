/** @jsxImportSource react */
import React from "react";
import SVGSprite from "@/app/components/SVGSprite.tsx";

export default function WorkbenchLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return <body>
    <SVGSprite/>
    {children}
    </body>;
}
