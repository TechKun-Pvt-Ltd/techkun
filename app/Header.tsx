'use client';
import {css} from "@emotion/react";
import LogoButton from "@/app/components/navbar-components/logo-button";
import React, {useEffect, useRef} from "react";
import MainCTA from "@/app/components/banner-components/MainCTA";
import EmailLink from "@/app/components/EmailLink";
import {contactMailAddress, linkedInAccountUrl, xAccountUrl} from "@/app/utils/constants";
import LinkedInLink from "@/app/components/LinkedInLink";
import XLink from "@/app/components/XLink";
import {CustomEvents} from "@/app/utils/custom-events";
import {usePathname} from "next/navigation";

const navCss = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3.2rem;
`;
const navButtonGroupCss = css`
    height: 100%;
    pointer-events: auto;
    display: flex;
    gap: 12px;

    transform: translateY(calc((1 - var(--_switch)) * -150%));
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
export default function Header() {
    const pathname = usePathname();
    const isHomepage = pathname === "/";
    const buttonGroup = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!isHomepage) return;
        if (!buttonGroup.current) return;
        const abortController = new AbortController();
        const links = buttonGroup.current.querySelectorAll<HTMLElement>(".contact-option");
        document.addEventListener(
            CustomEvents.CTA_ENTER_VIEWPORT,
            () => {
                for (const link of links) {
                    if (document.activeElement === link)
                        link.blur();
                    link.tabIndex = -1;
                }
                buttonGroup.current!.style.setProperty("--_switch", "0");
            },
            { signal: abortController.signal }
        );
        document.addEventListener(
            CustomEvents.CTA_EXIT_VIEWPORT,
            () => {
                for (const link of links)
                    link.tabIndex = 0;
                buttonGroup.current!.style.setProperty("--_switch", "1");
            },
            { signal: abortController.signal }
        );
        return () => abortController.abort();
    }, [isHomepage]);

    return <header style={{ pointerEvents: "none" }}>
        <nav css={navCss}>
            <LogoButton style={{ pointerEvents: "auto" }} />
            <div ref={buttonGroup} style={{ '--_switch': isHomepage ? "0" : "1" } as React.CSSProperties} css={navButtonGroupCss}>
                <div className="text-lg" css={socialLinksGroupCss}>
                    <XLink className="contact-option" href={xAccountUrl} />
                    <div className="divider" />
                    <LinkedInLink className="contact-option" href={linkedInAccountUrl} />
                    <div className="divider" />
                    <EmailLink className="contact-option" address={contactMailAddress} />
                </div>
                <MainCTA className="contact-option">Let's talk</MainCTA>
            </div>
        </nav>
    </header>;
};