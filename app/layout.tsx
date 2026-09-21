/** @jsxImportSource react */
import React from 'react';
import type { Metadata } from "next";
import "@/styling-system/globals.css";
import {siteUrl} from "@/app/utils/constants.ts";
import {OnceProvider} from "@/components/Once.tsx";

// Do not import local files with transitive imports in any of the css files
// The only job of these files is to export CSS strings
// TODO: Figure out an alternative with Linaria or Wyw-in-js
import "@/styling-system/build/css/typography";
import "@/styling-system/build/css/colors";
import "@/styling-system/build/css/spacing";
import "@/styling-system/build/css/radius";
import "@/styling-system/build/css/device-breakpoints";

// const Quicksand = localFont({
//     src: "../../fonts/Quicksand-VariableFont_wght.ttf",
//     weight: "100 900"
// });

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
    return <html lang="en"><OnceProvider>{children}</OnceProvider></html>;
}
