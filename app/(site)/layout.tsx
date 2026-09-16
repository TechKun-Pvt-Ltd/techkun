/** @jsxImportSource react */
import React from 'react';
import type { Metadata } from "next";
import SiteChrome from "@/app/(site)/components/SiteChrome.tsx";
import {siteUrl} from "@/app/utils/constants.ts";

const DESCRIPTION = "TechKun is a software studio building interfaces, products, and brand systems with beauty, precision, and identity.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "TechKun",
        template: "%s — TechKun",
    },
    description: DESCRIPTION,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: siteUrl,
        siteName: "TechKun",
        title: "TechKun",
        description: DESCRIPTION,
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        site: "@TechKun_",
        title: "TechKun",
        description: DESCRIPTION,
    },
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <SiteChrome>{children}</SiteChrome>;
}
