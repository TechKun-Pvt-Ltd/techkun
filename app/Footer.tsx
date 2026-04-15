'use client'
import {css} from "@emotion/react";
import TechKunLogo from "@/app/components/techkun-logo";
import React from "react";

export default function Footer() {
    return <footer css={css`
        border-top: 1px solid var(--muted);
        grid-template-rows: 1fr max-content;
    `}>
        <div css={css`
            display: grid;
            grid-template-columns: subgrid;
            align-content: space-between;
            padding-block: 72px 48px;
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
                    var(--secondary-950),
                    transparent
                );
            }
            &::after {
                height: calc(2 * 72px);
                transform: translateY(-50%);
                background: radial-gradient(
                    oklch(from var(--secondary-950) l c h / 0.3),
                    transparent 75%
                );
            }
        `}>
            <div css={css`
                grid-column: 1 / -1;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                gap: 32px;
                flex-wrap: wrap;

                & > p {
                    margin-block-end: 0.25em;
                    font-weight: 500;
                }
            `}>
                <div className="display-text" css={css`
                    display: flex;
                    align-items: center;
                    gap: 16px;
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
                        &:first-of-type {
                            margin-inline-end: 20px;
                        }
                    }
                `}>
                    <a href="./privacy">Privacy</a>
                    <a href="./terms">Terms</a>
                </p>
                <p style={{color: 'var(--muted-foreground)'}}>© 2026 TechKun. All rights reserved.</p>
            </div>
        </div>
        <div css={css`
            grid-column: 1 / -1;
            border-top: 1px solid var(--muted);
            text-align: center;
            color: oklch(0.5 0 0);

            & > p {
                margin-block: 8px;
                font-weight: 500;
            }
        `}>
            <p className="text-sm">This site is made by humans.</p>
        </div>
    </footer>
}