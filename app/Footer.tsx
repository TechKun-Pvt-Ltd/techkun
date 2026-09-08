'use client'
import {css} from "@emotion/react";
import TechKunLogo from "@/app/components/TechKunLogo";
import React from "react";
import Link from "next/link";

export default function Footer() {
    return <footer css={css`
        border-top: 1px solid var(--border);
        grid-template-rows: 1fr max-content;
    `}>
        <div className="pt-18 pb-12" css={css`
            display: grid;
            grid-template-columns: subgrid;
            align-content: space-between;
            padding-block: var(--space-18) var(--space-12);
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
                    var(--secondary-900) 45% 55%,
                    transparent
                );
            }
            &::after {
                height: calc(2 * var(--space-18));
                transform: translateY(-50%);
                background: radial-gradient(
                    oklch(from var(--secondary-900) l c h / 0.25),
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

                & > p {
                    font-weight: 500;
                }
            `}>
                <div className="display-text gap-4" css={css`
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                `}>
                    <TechKunLogo />
                    <span>TechKun</span>
                </div>
                <p css={css`
                    flex-grow: 1;
                    & > a {
                        color: var(--foreground);
                        text-decoration: none;
                    }
                `}>
                    <Link href="/privacy" className="mr-5">Privacy</Link>
                    <Link href="/terms">Terms</Link>
                </p>
                <p style={{color: 'var(--muted-foreground)'}}>© 2026 TechKun. All rights reserved.</p>
            </div>
        </div>
        <div css={css`
            grid-column: 1 / -1;
            border-top: 1px solid var(--border);
            text-align: center;
            color: var(--neutral-500);

            & > p {
                font-weight: 500;
            }
        `}>
            <p className="text-sm my-2">This site is made by humans.</p>
        </div>
    </footer>
}