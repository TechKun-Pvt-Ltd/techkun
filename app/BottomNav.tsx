"use client";
import React, {useEffect, useRef, useState} from "react";
import XLink from "@/app/components/XLink";
import {contactMailAddress, linkedInAccountUrl, xAccountUrl} from "@/app/utils/constants";
import LinkedInLink from "@/app/components/LinkedInLink";
import EmailLink from "@/app/components/EmailLink";
import MainCTA from "@/app/components/banner-components/MainCTA";
import {usePathname} from "next/navigation";
import {css} from "@emotion/react";
import navbarThresholdStatus from "@/app/utils/navbar-threshold-status";

const navButtonGroupCss = css`
    padding-block: 16px;
    height: 100%;
    pointer-events: auto;
    display: flex;
    gap: 12px;

    transform: translateY(calc((1 - var(--_switch)) * 150%));
    opacity: var(--_switch);
    transition: 0.3s ease;
    transition-property: transform, opacity;
`;
const socialLinksGroupCss = css`
    display: flex;
    align-items: center;
    gap: 0.75rem;

    padding-block: 0.5rem;
    padding-inline: 1rem;
    //border-radius: 0.75rem;
    border-radius: 100vh;
    corner-shape: superellipse(1.1);

    background: oklch(from var(--secondary-950) l c h / 0.96);
    backdrop-filter: blur(4px);
    border: 1px solid var(--secondary-900);
    a {
        padding: 0.25rem;
        color: var(--secondary-neutral-400);
    }
    .divider {
        width: 1px;
        height: 1em;
        background: var(--secondary-900);
    }
`;
export default function BottomNav() {
    const pathname = usePathname();
    const isHomepage = pathname === "/";
    const buttonGroup = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        const abortController = new AbortController();
        let currentIsAboveThreshold = false;
        function listener() {
            const isAboveThreshold = window.innerWidth <= 560;
            if (isAboveThreshold !== currentIsAboveThreshold)
                setIsMounted(currentIsAboveThreshold = isAboveThreshold);
        }
        listener();
        window.addEventListener("resize", listener, { signal: abortController.signal });
        return () => abortController.abort();
    }, []);
    useEffect(() => {
        if (!(isMounted && isHomepage && buttonGroup.current)) return;

        const buttonGroupElement = buttonGroup.current;
        const links = buttonGroupElement.querySelectorAll<HTMLElement>(".contact-option");
        function listener(belowThreshold: boolean) {
            for (const link of links) {
                if (!belowThreshold && document.activeElement === link)
                    link.blur();
                link.tabIndex = belowThreshold ? 0 : -1;
            }
            buttonGroupElement.style.setProperty("--_switch", belowThreshold ? "1" : "0");
        }
        listener(navbarThresholdStatus.get());
        return navbarThresholdStatus.onChange(listener);
    }, [isHomepage, isMounted]);

    return isMounted && <div
        className="bottom-nav"
        ref={buttonGroup}
        style={{'--_switch': isHomepage ? "0" : "1"} as React.CSSProperties}
        css={navButtonGroupCss}
    >
        <MainCTA className="contact-option">Let's talk</MainCTA>
        <div className="text-lg" css={socialLinksGroupCss}>
            <XLink className="contact-option" href={xAccountUrl}/>
            <div className="divider"/>
            <LinkedInLink className="contact-option" href={linkedInAccountUrl}/>
            <div className="divider"/>
            <EmailLink className="contact-option" address={contactMailAddress}/>
        </div>
    </div>;
}