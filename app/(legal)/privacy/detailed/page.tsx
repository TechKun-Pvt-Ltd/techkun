/** @jsxImportSource react */
import LegalBlocks from "@/app/components/LegalBlocks";
import {FULL_POLICY_BLOCKS, LAST_UPDATED, TOC_ITEMS} from "@/app/(legal)/privacy/content";
import Link from "next/link";

export default function DetailedPrivacyPage() {
    return <main id="top">
        <section>
            <div className="legal-page pt-24 gap-16">
                <header className="legal-header">
                    <Link href="/privacy" className="legal-link text-sm mb-3" style={{display: "block"}}>← Back to Privacy Policy</Link>
                    <h1 className="section-title">Detailed Privacy Policy</h1>
                    <p className="text-base py-1 px-3">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div>
                    <nav aria-label="Detailed Privacy Policy contents" className="legal-toc mb-8 py-5 px-6">
                        <ul className="gap-y-2 gap-x-6">
                            {TOC_ITEMS.map(item => <li key={item.id} className="text-sm">
                                <Link href={`#${item.id}`} className="legal-link">{item.title}</Link>
                            </li>)}
                        </ul>
                    </nav>
                    <div className="legal-content">
                        <LegalBlocks blocks={FULL_POLICY_BLOCKS} />
                    </div>
                    <p className="text-sm mt-10">
                        <Link href="#top" className="legal-link">Back to top ↑</Link>
                    </p>
                </div>
            </div>
        </section>
    </main>;
};
