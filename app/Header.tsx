'use client';
import React from 'react';
import {css, keyframes} from "@emotion/react"
import TechKunLogo from "@/app/components/techkun-logo";

const moveGradient = keyframes`
    from {
        background-position: 100% 50%;
    }
    to {
        background-position: 0 50%;
    }
`;

export default function Header() {
    return <header css={css`
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
                <span css={css`
                    color: transparent;
                    background-image: linear-gradient(to right in oklch, var(--foreground) 33.33%, var(--secondary-500), var(--primary-500), transparent 66.66%);
                    background-size: 300% 100%;
                    background-position: 100% 50%;
                    background-clip: text;
                    animation: ${moveGradient} 1.2s 0.2s ease-in-out both;
                `}>TechKun</span>
            </div>
        </nav>
    </header>;
};