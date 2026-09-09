"use client";
import React from "react";
import {css} from "@emotion/react";
import Link from "next/link";

const buttonCss = css`
    display: inline-block;
    border-radius: 1rem;
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
                <Link href="/" className="text-lg py-3 px-7" css={buttonCss}>
                    Take me home
                </Link>
            </div>
        </section>
    </main>;
};
