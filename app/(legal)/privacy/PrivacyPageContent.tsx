"use client";
import LegalBlocks from "@/app/components/LegalBlocks";
import {LAST_UPDATED, SUMMARY_BLOCKS, TRIMMED_BLOCKS} from "@/app/(legal)/privacy/content";
import {css} from "@emotion/react";
import Link from "next/link";

const summaryCardCss = css`
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--muted);

    & p {
        color: var(--muted-foreground);
    }
`;

export default function PrivacyPageContent() {
    return <main>
        <section>
            <div className="legal-page pt-24 gap-16">
                <header className="legal-header">
                    <h1 className="section-title">Privacy Policy</h1>
                    <p className="text-base py-1 px-3">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div className="gap-3 py-6 px-7" css={summaryCardCss}>
                    <h2 className="text-lg" style={{fontWeight: 600}}>Privacy Summary</h2>
                    <div className="legal-content">
                        <LegalBlocks blocks={SUMMARY_BLOCKS} />
                    </div>
                    <Link href="/privacy/detailed" className="legal-link text-sm">
                        Read the detailed Privacy Policy →
                    </Link>
                </div>

                <div>
                    <h2 className="item-title mb-6">
                        Privacy Policy — Short Version
                    </h2>
                    <div className="legal-content">
                        <LegalBlocks blocks={TRIMMED_BLOCKS} />
                        <p className="text-base">
                            For full legal details, definitions, and region-specific rights, read our{" "}
                            <Link href="/privacy/detailed" className="legal-link">Detailed Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>;
};
