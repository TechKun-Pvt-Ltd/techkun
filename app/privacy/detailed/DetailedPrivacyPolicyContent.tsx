"use client";
import LegalBlocks from "@/app/components/LegalBlocks";
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
        border-radius: 0.5rem;
    }
`;

export default function DetailedPrivacyPolicyContent() {
    return <main id="top">
        <section>
            <div className="pt-24 gap-16" css={pageCss}>
                <header css={headerCss}>
                    <Link href="/privacy" css={linkCss} className="text-sm mb-3" style={{display: "block"}}>← Back to Privacy Policy</Link>
                    <h1 className="section-title">Detailed Privacy Policy</h1>
                    <p className="text-base py-1 px-3">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div>
                    <nav aria-label="Detailed Privacy Policy contents" className="mb-8 py-5 px-6" css={tocCss}>
                        <ul className="gap-y-2 gap-x-6">
                            {TOC_ITEMS.map(item => <li key={item.id} className="text-sm">
                                <Link href={`#${item.id}`} css={linkCss}>{item.title}</Link>
                            </li>)}
                        </ul>
                    </nav>
                    <div css={legalContentCss}>
                        <LegalBlocks blocks={FULL_POLICY_BLOCKS} />
                    </div>
                    <p className="text-sm mt-10">
                        <Link href="#top" css={linkCss}>Back to top ↑</Link>
                    </p>
                </div>
            </div>
        </section>
    </main>;
};
