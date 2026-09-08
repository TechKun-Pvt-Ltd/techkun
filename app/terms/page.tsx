"use client";
import {css} from "@emotion/react";
import LegalBlocks from "@/app/components/LegalBlocks";
import {INTRO_BLOCKS, LAST_UPDATED, TERMS_BLOCKS, TOC_ITEMS} from "@/app/terms/content";
import Link from "next/link";

const pageCss = css`
    max-width: 46rem;
    margin-inline: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const linkCss = css`
    color: var(--primary-200);
    text-decoration: none;

    &:hover, &:focus-visible {
        text-decoration: underline;
    }
`;

const legalContentCss = css`
    display: flex;
    flex-direction: column;

    & > * {
        margin-block-end: var(--space-4);
    }
    & > :last-child {
        margin-block-end: 0;
    }

    & h3, & h4 {
        margin-block-end: 0.5em;
    }
    & h3 {
        margin-block-start: var(--space-10);
        padding-block-start: var(--space-8);
        border-top: 1px solid var(--border);
    }
    & h3:first-of-type {
        margin-block-start: 0;
        padding-block-start: 0;
        border-top: none;
    }
    & h4 {
        margin-block-start: var(--space-6);
    }
    & p {
        color: var(--muted-foreground);
    }
    & a {
        color: var(--primary-200);
    }
    & ul {
        list-style: disc;
        padding-inline-start: 1.25em;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        color: var(--muted-foreground);
    }
    & dl {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: var(--space-2) var(--space-6);
    }
    & dt {
        color: var(--foreground);
        font-weight: 500;
    }
    & dd {
        margin-inline-start: 0;
        color: var(--muted-foreground);
    }
`;

const tocCss = css`
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--muted);

    & ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
`;

const headerCss = css`
    h1 {
        margin-block-end: 0.25em;
    }
    p {
        color: var(--muted-foreground);
        background-color: var(--muted);
        width: max-content;
        border-radius: 0.5rem;
    }
`;

export default function Terms() {
    return <main id="top">
        <section>
            <div className="pt-24 pb-30 gap-16" css={pageCss}>
                <header css={headerCss}>
                    <h1 className="section-title">Terms and Conditions</h1>
                    <p className="text-base py-1 px-3">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div css={legalContentCss}>
                    <LegalBlocks blocks={INTRO_BLOCKS} />
                </div>

                <div>
                    <nav aria-label="Terms and Conditions contents" className="mb-8 py-5 px-6" css={tocCss}>
                        <ul className="gap-y-2 gap-x-6">
                            {TOC_ITEMS.map(item => <li key={item.id} className="text-sm">
                                <Link href={`#${item.id}`} css={linkCss}>{item.title}</Link>
                            </li>)}
                        </ul>
                    </nav>
                    <div css={legalContentCss}>
                        <LegalBlocks blocks={TERMS_BLOCKS} />
                    </div>
                    <p className="text-sm mt-10">
                        <Link href="#top" css={linkCss}>Back to top ↑</Link>
                    </p>
                </div>
            </div>
        </section>
    </main>;
};
