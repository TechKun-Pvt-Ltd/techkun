/** @jsxImportSource react */
import React from 'react';
import Header from "@/app/(site)/components/Header.tsx";
import Footer from "@/app/(site)/components/Footer.tsx";
import Shared from "@/app/(site)/components/Shared.tsx";
import BottomNav from "@/app/(site)/components/BottomNav.tsx";
import {siteUrl, xAccountUrl, linkedInAccountUrl} from "@/app/utils/constants.ts";

const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TechKun",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    sameAs: [linkedInAccountUrl, xAccountUrl],
};

export default function SiteChrome({
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
