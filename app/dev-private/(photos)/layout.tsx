/** @jsxImportSource react */
import React from "react";

export default function PhotosLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return <div style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}>{children}</div>;
}