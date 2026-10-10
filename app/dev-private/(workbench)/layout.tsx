/** @jsxImportSource react */
import React from "react";
import SVGSprite from "@/iconography/SVGSprite.tsx";

export default function WorkbenchLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return <body>
    <SVGSprite/>
    {children}
    </body>;
}
