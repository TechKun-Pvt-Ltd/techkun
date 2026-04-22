'use client';
import React from 'react';
import { css } from "@emotion/react"
import TechKunLogo from "@/app/components/techkun-logo";
import Button from "@/app/components/ui/Button";

export default function Header() {
    return <header css={css`
        border-bottom: var(--border) 1px solid;
        box-shadow: 0.5px 1px 1px oklch(0 0 0 / 0.7);
        background-color: oklch(from var(--background) l c h / 0.375);
        backdrop-filter: blur(10px);
    `}>
        <nav css={css`
            grid-row: 1 / -1;
            display: flex;
            justify-content: space-between;
            align-items: center;
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
            <div>
                <Button textColor="var(--foreground)"
                    backgroundColor="var(--primary-800)"
                >Let's talk</Button>
            </div>
        </nav>
    </header>;
};