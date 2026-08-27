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
import useAbortSignal from "@/hooks/use-abort-signal";

export default function Header() {
    const buttonGroup = useRef<HTMLDivElement>(null);
    const abortSignal = useAbortSignal();
    useEffect(() => {
        if (!buttonGroup.current) return;
        document.addEventListener(CustomEvents.CTA_ENTER_VIEWPORT, () => buttonGroup.current!.style.setProperty("--_switch", "0"), { signal: abortSignal });
        document.addEventListener(CustomEvents.CTA_EXIT_VIEWPORT, () => buttonGroup.current!.style.setProperty("--_switch", "1"), { signal: abortSignal });
    }, []);
    return <header style={{ pointerEvents: "none" }}>
        <nav css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 3.2rem;
        `}>
            <LogoButton style={{ pointerEvents: "auto" }} />
            <div ref={buttonGroup} style={{ '--_switch': "0" } as React.CSSProperties} css={css`
                height: 100%;
                pointer-events: auto;
                display: flex;
                gap: 16px;

                transform: translateY(calc((1 - var(--_switch)) * -150%));
                opacity: var(--_switch);
                transition: 0.3s ease;
                transition-property: transform, opacity;
            `}>
                <button className="text-lg" css={css`
                    cursor: default;
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
                `}>
                    <XLink href={xAccountUrl} />
                    <div className="divider" />
                    <LinkedInLink href={linkedInAccountUrl} />
                    <div className="divider" />
                    <EmailLink address={contactMailAddress} />
                </button>
                <GradientBorderButton>Let's talk</GradientBorderButton>
            </div>
        </nav>
    </header>;
};