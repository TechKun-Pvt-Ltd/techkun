import {css} from "@emotion/react";

export const pageCss = css`
    max-width: 46rem;
    margin-inline: auto;
    width: 100%;
    padding-block-end: 120px;
    display: flex;
    flex-direction: column;
`;

export const linkCss = css`
    color: var(--primary-300);
    text-decoration: none;

    &:hover, &:focus-visible {
        text-decoration: underline;
    }
`;

export const legalContentCss = css`
    display: flex;
    flex-direction: column;

    & > * {
        margin-block-end: var(--space-4);
    }
    & > :last-child {
        margin-block-end: 0;
    }

    & h3, & h4, & h5 {
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
    & h5 {
        margin-block-start: var(--space-4);
    }
    & p {
        color: var(--muted-foreground);
    }
    & a {
        color: var(--primary-300);
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

export const summaryCardCss = css`
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--muted);

    & p {
        color: var(--muted-foreground);
    }
`;

export const tocCss = css`
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--muted);

    & ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
`;
