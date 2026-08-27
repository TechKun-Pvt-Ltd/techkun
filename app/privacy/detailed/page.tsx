"use client";
import LegalBlocks from "@/app/privacy/components/legal-blocks";
import {legalContentCss, linkCss, pageCss, tocCss} from "@/app/privacy/styles";
import {FULL_POLICY_BLOCKS, LAST_UPDATED, TOC_ITEMS} from "@/app/privacy/content";
import {css} from "@emotion/react";
import Link from "next/link";

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

export default function DetailedPrivacyPolicy() {
    return <main id="top">
        <section>
            <div css={pageCss}>
                <header css={headerCss}>
                    <Link href="/privacy" css={linkCss} className="text-sm" style={{display: "block", marginBlockEnd: "0.75rem"}}>← Back to Privacy Policy</Link>
                    <h1 className="section-title">Detailed Privacy Policy</h1>
                    <p className="text-base">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div>
                    <nav aria-label="Detailed Privacy Policy contents" css={tocCss}>
                        <ul>
                            {TOC_ITEMS.map(item => <li key={item.id} className="text-sm">
                                <Link href={`#${item.id}`} css={linkCss}>{item.title}</Link>
                            </li>)}
                        </ul>
                    </nav>
                    <div css={legalContentCss}>
                        <LegalBlocks blocks={FULL_POLICY_BLOCKS} />
                    </div>
                    <p className="text-sm" style={{marginBlockStart: "2.5rem"}}>
                        <Link href="#top" css={linkCss}>Back to top ↑</Link>
                    </p>
                </div>
            </div>
        </section>
    </main>;
};
