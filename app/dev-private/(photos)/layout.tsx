/** @jsxImportSource react */
import React from "react";

export default function PhotosLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return <body style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--neutral-800)"
    }}>{children}</body>;
}