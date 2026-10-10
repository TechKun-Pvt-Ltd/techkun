/** @jsxImportSource react */
import React from 'react';
import type { Metadata } from "next";
import "@/styling/globals.css";
import {siteUrl} from "@/app/utils/constants.ts";
import {OnceProvider} from "@/components/render-control/Once.tsx";

import "@/styling/build-css/typography";
import "@/styling/build-css/colors";
import "@/styling/build-css/spacing";
import "@/styling/build-css/radius";
import "@/styling/build-css/device-breakpoints";
import "@/styling/build-css/motion";

import "@/iconography/icons.css";

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
