/** @jsxImportSource react */
import React from 'react';
import type { Metadata } from "next";
import Header from "@/app/(site)/components/Header.tsx";
import Footer from "@/app/(site)/components/Footer.tsx";
import Shared from "@/app/(site)/components/Shared.tsx";
import BottomNav from "@/app/(site)/components/BottomNav.tsx";
import {siteUrl, xAccountUrl, linkedInAccountUrl} from "@/app/utils/constants.ts";

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
    return <body className="root-layout">
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
    </body>;
}
