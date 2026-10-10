"use client";
/** @jsxImportSource react */
import React, {useEffect, useRef} from 'react';
import {usePathname} from "next/navigation";
import Header, {type HeaderHandle} from "@/components/site-chrome/Header.tsx";
import BottomNav, {type BottomNavHandle} from "@/components/site-chrome/BottomNav.tsx";
import Footer from "@/app/(site)/components/Footer.tsx";
import Shared from "@/app/(site)/components/Shared.tsx";
import {useMediaQuery} from "@/hooks/use-media-query.ts";
import navbarThresholdStatus from "@/app/utils/navbar-threshold-status";
import {linkedInAccountUrl, siteUrl, xAccountUrl} from "@/app/utils/constants.ts";

const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TechKun",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    sameAs: [linkedInAccountUrl, xAccountUrl],
};

// Below this viewport width, the nav's contact options move from the header into the bottom nav.
const NAV_CONTACT_OPTIONS_BREAKPOINT_REM = 35;
export const NAV_CONTACT_OPTIONS_NARROW_QUERY = `(max-width: ${NAV_CONTACT_OPTIONS_BREAKPOINT_REM}rem)`;

export default function SiteChrome({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const isHomepage = pathname === "/";
    const isNarrowViewport = useMediaQuery(NAV_CONTACT_OPTIONS_NARROW_QUERY);
    const headerRef = useRef<HeaderHandle>(null);
    const bottomNavRef = useRef<BottomNavHandle>(null);

    // On the homepage, past the navbar threshold the header collapses and the bottom nav shows; elsewhere,
    // the header expands while the page is at least half in view.
    useEffect(() => {
        if (pathname !== "/") {
            const intersectionObserver = new IntersectionObserver(
                entries => entries.at(0)?.isIntersecting ? headerRef.current?.expand() : headerRef.current?.collapse(),
                { threshold: 0.5 }
            );
            intersectionObserver.observe(document.documentElement);
            return () => intersectionObserver.unobserve(document.documentElement);
        }

        function update(crossed: boolean) {
            if (crossed) {
                headerRef.current?.collapse();
                bottomNavRef.current?.show();
            } else {
                headerRef.current?.expand();
                bottomNavRef.current?.hide();
            }
        }
        // Also applied right away: the contact options remount, hidden, when the viewport crosses the narrow breakpoint.
        update(navbarThresholdStatus.get());
        return navbarThresholdStatus.onChange(update);
    }, [pathname, isNarrowViewport]);

    return <body className="root-layout">
        <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd)}}
        />
        <Shared />
        {/*process.env.NODE_ENV === "development" && <PalettePreviewOverlay/>*/}
        <Header ref={headerRef} isHomepage={isHomepage} hasContactOptions={!isNarrowViewport} />
        {children}
        {isNarrowViewport && <BottomNav ref={bottomNavRef} isHomepage={isHomepage} />}
        <Footer />
    </body>;
}
