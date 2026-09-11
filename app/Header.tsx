'use client';
import {css} from "@emotion/react";
import LogoButton from "@/app/components/navbar-components/LogoButton";
import React from "react";
import {usePathname} from "next/navigation";
import {useMediaQuery} from "@/hooks/use-media-query";
import ContactOptionsGroup from "@/app/components/contact-options/ContactOptionsGroup.tsx";
import {NAV_CONTACT_OPTIONS_NARROW_QUERY} from "@/app/components/contact-options/constants.ts";

const navCss = css`
    display: flex;
    justify-content: space-between;
    align-items: stretch;
`;
export default function Header() {
    const pathname = usePathname();
    const isHomepage = pathname === "/";
    const isNarrowViewport = useMediaQuery(NAV_CONTACT_OPTIONS_NARROW_QUERY);

    return <header style={{ pointerEvents: "none" }}>
        <nav css={navCss}>
            <LogoButton style={{ pointerEvents: "auto", marginBlock: "-2px" }} />
            {!isNarrowViewport && <ContactOptionsGroup isHomepage={isHomepage} variant="header" />}
        </nav>
    </header>;
};
