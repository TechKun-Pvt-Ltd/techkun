'use client';
import {css} from "@emotion/react";
import LogoButton from "@/app/components/navbar-components/logo-button";
import React, {useEffect, useRef} from "react";
import GradientBorderButton from "@/app/components/banner-components/GradientBorderButton";
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
    gap: 16px;

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
    border-radius: 0.625rem;

    background: oklch(from var(--secondary-neutral-900) l c h / 0.625);
    backdrop-filter: blur(12px);
    border: 1px solid var(--secondary-neutral-800);
    a {
        padding: 0.25rem;
        color: var(--secondary-neutral-400);
    }
    .divider {
        width: 1px;
        height: 1em;
        background: var(--secondary-neutral-800);
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
        document.addEventListener(
            CustomEvents.CTA_ENTER_VIEWPORT,
            () => buttonGroup.current!.style.setProperty("--_switch", "0"),
            { signal: abortController.signal }
        );
        document.addEventListener(
            CustomEvents.CTA_EXIT_VIEWPORT,
            () => buttonGroup.current!.style.setProperty("--_switch", "1"),
            { signal: abortController.signal }
        );
        return () => abortController.abort();
    }, [isHomepage]);

    return <header style={{ pointerEvents: "none" }}>
        <nav css={navCss}>
            <LogoButton style={{ pointerEvents: "auto" }} />
            <div ref={buttonGroup} style={{ '--_switch': isHomepage ? "0" : "1" } as React.CSSProperties} css={navButtonGroupCss}>
                <div className="text-lg" css={socialLinksGroupCss}>
                    <XLink href={xAccountUrl} />
                    <div className="divider" />
                    <LinkedInLink href={linkedInAccountUrl} />
                    <div className="divider" />
                    <EmailLink address={contactMailAddress} />
                </div>
                <GradientBorderButton>Let's talk</GradientBorderButton>
            </div>
        </nav>
    </header>;
};