/** @jsxImportSource react */
import React from 'react';
import type { Metadata } from "next";
import "@/app/styles/globals.css";
import Header from "@/app/Header";
import localFont from "next/font/local";
import Footer from "@/app/Footer";
import Shared from "@/app/Shared";

// Do not import local files with transitive imports in any of the `css.mjs` files
// The only job of these files is to export CSS strings
// TODO: Figure out an alternative with Linaria or Wyw-in-js
import "@/app/styles/generated-css/typography.css";
import "@/app/styles/generated-css/colors.css";
import "@/app/styles/generated-css/spacing.css";
import "@/app/styles/generated-css/device-breakpoints.css";
import BottomNav from "@/app/BottomNav";
import {siteUrl, xAccountUrl, linkedInAccountUrl} from "@/app/utils/constants";

const Quicksand = localFont({
    src: "./fonts/Quicksand-VariableFont_wght.ttf",
    weight: "100 900"
});

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

const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TechKun",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    sameAs: [linkedInAccountUrl, xAccountUrl],
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <script
                    type="application/ld+json"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd)}}
                />
                <Shared />
                {/*process.env.NODE_ENV === "development" && <PalettePreviewOverlay/>*/}
                <Header />
                {children}
                <BottomNav />
                <Footer />
            </body>
        </html>
    );
}
