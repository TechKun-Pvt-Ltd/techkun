'use client'
import {css} from "@emotion/react";
import TechKunLogo from "@/app/components/TechKunLogo.tsx";
import React from "react";
import Link from "next/link";

export default function Footer() {
    return <footer css={css`
        border-top: 1px solid var(--color-border-default);
        grid-template-rows: 1fr max-content;
    `}>
        <div className="pt-18 pb-12" css={css`
            display: grid;
            grid-template-columns: subgrid;
            align-content: space-between;
            position: relative;
            overflow: hidden;
            &::before, &::after {
                content: "";
                position: absolute;
                inset: 0 0 auto 0;
                margin-inline: auto;
                width: 100%;
            }
            &::before {
                height: 1px;
                background: linear-gradient(
                    to right,
                    transparent,
                    var(--color-border-accent) 45% 55%,
                    transparent
                );
            }
            &::after {
                height: calc(2 * var(--space-18));
                transform: translateY(-50%);
                background: radial-gradient(
                    oklch(from var(--color-brand-2-900) l c h / 0.25),
                    transparent 75%
                );
            }
        `}>
            <div className="gap-8" css={css`
                grid-column: 1 / -1;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                flex-wrap: wrap;
            `}>
                <div className="logo-text gap-4" css={css`
                    display: flex;
                    align-items: center;
                `}>
                    <TechKunLogo />
                    <span>TechKun</span>
                </div>
                <p css={css`
					font-weight: var(--font-weight-medium);
                    flex-grow: 1;
                    & > a {
                        color: var(--color-text-primary);
                        text-decoration: none;
                    }
                `}>
                    <Link href="/privacy" className="mr-5">Privacy</Link>
                    <Link href="/terms">Terms</Link>
                </p>
                <p style={{color: 'var(--color-text-tertiary)'}}>© 2026 TechKun. All rights reserved.</p>
            </div>
        </div>
        <div css={css`
            grid-column: 1 / -1;
            border-top: 1px solid var(--color-border-default);
            text-align: center;
            color: var(--color-text-tertiary);
        `}>
            <p className="type-body-sm font-medium my-2">This site is made by humans.</p>
        </div>
    </footer>
}