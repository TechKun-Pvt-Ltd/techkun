"use client";
import React from "react";
import {css} from "@emotion/react";
import Link from "next/link";

const STAMP_RED = "#dc2626";

const eyebrowCss = css`
    display: block;
    color: var(--secondary-neutral-400);
    font-weight: 500;
`;

const stampCss = css`
    display: inline-block;
    margin-block-start: 0.5em;
    padding: 0.15em 0.5em;
    border: 3px solid ${STAMP_RED};
    border-radius: 2px;
    outline: 3px solid ${STAMP_RED};
    outline-offset: 6px;
    transform: rotate(-6deg);
    color: ${STAMP_RED};
    font-family: Impact, "Arial Narrow Bold", "Franklin Gothic Bold", sans-serif;
    font-size: clamp(2.25rem, 7vw, 4rem);
    font-weight: 900;
    letter-spacing: 0.06em;
    line-height: 1;
    text-transform: uppercase;
    user-select: none;
`;

const classifiedCss = css`
    font-family: Impact, "Arial Narrow", "Franklin Gothic Medium", sans-serif;
    font-weight: 400;
    letter-spacing: 0.02em;
`;

const buttonCss = css`
    display: inline-block;
    padding: 0.75rem 1.75rem;
    border-radius: 0.6rem;
    border: 1px solid var(--border);
    color: var(--foreground);
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.15s ease, border-color 0.15s ease;

    &:hover, &:focus-visible {
        background-color: var(--muted);
        border-color: var(--secondary-neutral-700);
    }
`;

export default function NotFound() {
    return <main>
        <section css={css`
            justify-items: center;
        `}>
            <div css={css`
                min-height: var(--section-height);
                width: 100%;
                max-width: 40rem;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
            `}>
                <div>
                    <h1 css={css`margin-block-end: 1.25em;`}>
                        <span className="text-lg" css={eyebrowCss}>This page is currently</span>
                        <span css={stampCss}>Missing</span>
                    </h1>
                    <p className="section-subtitle" css={[classifiedCss, css`margin-block-end: 40px;`]}>
                        Don't worry, we have it under control — the FBI is looking for it.
                        Further details are classified.
                    </p>
                    <Link href="/" className="text-lg" css={[classifiedCss, buttonCss]}>
                        You should go home
                    </Link>
                </div>
            </div>
        </section>
    </main>;
};
