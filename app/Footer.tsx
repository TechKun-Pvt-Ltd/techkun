'use client'
import {css} from "@emotion/react";
import TechKunLogo from "@/app/components/techkun-logo";
import React from "react";

export default function Footer() {
    return <footer css={css`
        background-color: var(--muted);
        grid-template-rows: 1fr max-content;
    `}>
        <div css={css`
            display: grid;
            grid-template-columns: subgrid;
            align-content: space-between;
            padding-block: 48px;
        `}>
            <div css={css`
                grid-column: 1 / -1;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                gap: 32px;

                & > p {
                    font-weight: 500;
                }
            `}>
                <div className="text-xl" css={css`
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
            border-top: 1px solid oklch(0.3 0 0);
            text-align: center;
            color: var(--muted-foreground);

            & > p {
                margin-block: 8px;
                font-weight: 500;
            }
        `}>
            <p className="text-sm">This site is made by humans.</p>
        </div>
    </footer>
}