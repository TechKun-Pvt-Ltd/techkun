'use client';
import {css, keyframes} from "@emotion/react";
import LogoButton from "@/app/components/navbar-components/logo-button";
import React from "react";
import GradientBorderButton from "@/app/components/banner-components/GradientBorderButton";
import EmailLink from "@/app/components/EmailLink";
import {contactMailAddress, linkedInAccountUrl, xAccountUrl} from "@/app/utils/constants";
import LinkedInLink from "@/app/components/LinkedInLink";
import XLink from "@/app/components/XLink";

const slideIn = keyframes`
    from { --in-view: 0; }
    to { --in-view: 1; }
`;
export default function Header() {
    return <header style={{ pointerEvents: "none" }}>
        <nav css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 3.2rem;
        `}>
            <LogoButton style={{ pointerEvents: "auto" }} />
            <div css={css`
                height: 100%;
                pointer-events: auto;
                display: flex;
                gap: 16px;
                --in-view: 0;
                animation: ${slideIn} both;
                animation-timeline: --header-cta-slide-in;
                animation-range: exit 50%;
                > * {
                    transform: translateY(calc((1 - var(--in-view)) * -150%));
                    opacity: var(--in-view);
                    transition: 0.3s 0.15s ease;
                    transition-property: transform, opacity;
                }
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