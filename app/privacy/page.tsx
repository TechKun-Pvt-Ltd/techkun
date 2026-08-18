"use client";
import LegalBlocks from "@/app/privacy/components/legal-blocks";
import {legalContentCss, linkCss, pageCss, summaryCardCss} from "@/app/privacy/styles";
import {LAST_UPDATED, SUMMARY_BLOCKS, TRIMMED_BLOCKS} from "@/app/privacy/content";
import {css} from "@emotion/react";

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

export default function Privacy() {
    return <main>
        <section>
            <div css={pageCss}>
                <header css={headerCss}>
                    <h1 className="section-title">Privacy Policy</h1>
                    <p className="text-base">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div css={summaryCardCss}>
                    <h2 className="text-lg" style={{fontWeight: 600}}>Privacy Summary</h2>
                    <div css={legalContentCss}>
                        <LegalBlocks blocks={SUMMARY_BLOCKS} />
                    </div>
                    <a href="/privacy/detailed" className="text-sm" css={linkCss}>
                        Read the detailed Privacy Policy →
                    </a>
                </div>

                <div>
                    <h2 className="item-title" style={{marginBlockEnd: "1.5rem"}}>
                        Privacy Policy — Short Version
                    </h2>
                    <div css={legalContentCss}>
                        <LegalBlocks blocks={TRIMMED_BLOCKS} />
                        <p className="text-base">
                            For full legal details, definitions, and region-specific rights, read our{" "}
                            <a href="/privacy/detailed" css={linkCss}>Detailed Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>;
};
