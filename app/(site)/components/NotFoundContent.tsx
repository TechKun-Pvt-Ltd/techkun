"use client";
import React from "react";
import {css} from "@emotion/react";
import Link from "next/link";

const buttonCss = css`
    display: inline-block;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border-default);
    color: var(--color-text-primary);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: background-color 0.15s ease, border-color 0.15s ease;

    &:hover, &:focus-visible {
        background-color: var(--color-bg-surface);
        border-color: var(--color-border-strong);
    }
`;

export default function NotFoundContent() {
    return <main>
        <section css={css`
            padding-block-start: 2%;
            justify-items: center;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        `}>
            <div css={css`
                width: 100%;
                max-width: 40rem;
            `}>
                <h1 className="section-title" css={css`margin-block-end: 0.5em;`}>
                    Page not found
                </h1>
                <p className="section-subtitle mb-10">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link href="/public" className="type-body-lg py-3 px-7" css={buttonCss}>
                    Take me home
                </Link>
            </div>
        </section>
    </main>;
};
