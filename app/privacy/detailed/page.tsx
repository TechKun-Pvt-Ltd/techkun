"use client";
import LegalBlocks from "@/app/privacy/components/legal-blocks";
import {legalContentCss, linkCss, pageCss, tocCss} from "@/app/privacy/styles";
import {FULL_POLICY_BLOCKS, LAST_UPDATED, TOC_ITEMS} from "@/app/privacy/content";

export default function DetailedPrivacyPolicy() {
    return <main id="top">
        <section>
            <div css={pageCss}>
                <header>
                    <p className="text-sm" style={{marginBlockEnd: "0.75rem"}}>
                        <a href="/privacy" css={linkCss}>← Back to Privacy Policy</a>
                    </p>
                    <h1 className="section-title">Detailed Privacy Policy</h1>
                    <p className="text-sm" style={{color: "var(--muted-foreground)"}}>
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div>
                    <nav aria-label="Detailed Privacy Policy contents" css={tocCss}>
                        <ul>
                            {TOC_ITEMS.map(item => <li key={item.id} className="text-sm">
                                <a href={`#${item.id}`} css={linkCss}>{item.title}</a>
                            </li>)}
                        </ul>
                    </nav>
                    <div css={legalContentCss}>
                        <LegalBlocks blocks={FULL_POLICY_BLOCKS} />
                    </div>
                    <p className="text-sm" style={{marginBlockStart: "2.5rem"}}>
                        <a href="#top" css={linkCss}>Back to top ↑</a>
                    </p>
                </div>
            </div>
        </section>
    </main>;
};
