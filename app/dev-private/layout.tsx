/** @jsxImportSource react */
import {notFound} from "next/navigation";
import React from "react";

export default function DevPrivateLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    if (process.env.NODE_ENV === "production")
        notFound();

    return <body>{children}</body>;
}