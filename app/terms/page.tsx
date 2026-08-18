"use client";
import {css} from "@emotion/react";
import LegalBlocks from "@/app/terms/components/legal-blocks";
import {INTRO_BLOCKS, LAST_UPDATED, TERMS_BLOCKS, TOC_ITEMS} from "@/app/terms/content";

const pageCss = css`
    max-width: 46rem;
    margin-inline: auto;
    width: 100%;
    padding-block: 96px 120px;
    display: flex;
    flex-direction: column;
    gap: 4rem;
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
        margin-block-end: 1rem;
    }
    & > :last-child {
        margin-block-end: 0;
    }

    & h3, & h4 {
        margin-block-end: 0.5em;
    }
    & h3 {
        margin-block-start: 2.5rem;
        padding-block-start: 2rem;
        border-top: 1px solid var(--border);
    }
    & h3:first-of-type {
        margin-block-start: 0;
        padding-block-start: 0;
        border-top: none;
    }
    & h4 {
        margin-block-start: 1.5rem;
    }
    & p {
        color: var(--muted-foreground);
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
        gap: 0.5rem 1.5rem;
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
    margin-block-end: 2rem;
    padding: 20px 24px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--muted);

    & ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 0.5rem 1.5rem;
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
        padding: 4px 12px;
        border-radius: 0.5rem;
    }
`;

export default function Terms() {
    return <main id="top">
        <section>
            <div css={pageCss}>
                <header css={headerCss}>
                    <h1 className="section-title">Terms and Conditions</h1>
                    <p className="text-base">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div css={legalContentCss}>
                    <LegalBlocks blocks={INTRO_BLOCKS} />
                </div>

                <div>
                    <nav aria-label="Terms and Conditions contents" css={tocCss}>
                        <ul>
                            {TOC_ITEMS.map(item => <li key={item.id} className="text-sm">
                                <a href={`#${item.id}`} css={linkCss}>{item.title}</a>
                            </li>)}
                        </ul>
                    </nav>
                    <div css={legalContentCss}>
                        <LegalBlocks blocks={TERMS_BLOCKS} />
                    </div>
                    <p className="text-sm" style={{marginBlockStart: "2.5rem"}}>
                        <a href="#top" css={linkCss}>Back to top ↑</a>
                    </p>
                </div>
            </div>
        </section>
    </main>;
};
