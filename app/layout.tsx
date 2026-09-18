/** @jsxImportSource react */
import React from 'react';
import type { Metadata } from "next";
import "@/app/styles/globals.css";
import {siteUrl} from "@/app/utils/constants.ts";
import {OnceProvider} from "@/components/Once.tsx";

// Do not import local files with transitive imports in any of the `css.mjs` files
// The only job of these files is to export CSS strings
// TODO: Figure out an alternative with Linaria or Wyw-in-js
import "@/app/styles/generated-css/typography.css";
import "@/app/styles/generated-css/colors.css";
import "@/app/styles/generated-css/spacing.css";
import "@/app/styles/generated-css/radius.css";
import "@/app/styles/generated-css/device-breakpoints.css";

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
