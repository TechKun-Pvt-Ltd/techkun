/** @jsxImportSource react */
import React from 'react';
import SiteChrome from "@/app/(site)/components/SiteChrome.tsx";

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <SiteChrome>{children}</SiteChrome>;
}
