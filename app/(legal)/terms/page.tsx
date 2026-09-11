/** @jsxImportSource react */
import LegalBlocks from "@/app/components/LegalBlocks";
import {INTRO_BLOCKS, LAST_UPDATED, TERMS_BLOCKS, TOC_ITEMS} from "@/app/(legal)/terms/content";
import Link from "next/link";

export default function TermsPage() {
    return <main id="top">
        <section>
            <div className="legal-page pt-24 gap-16">
                <header className="legal-header">
                    <h1 className="section-title">Terms and Conditions</h1>
                    <p className="text-base py-1 px-3">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <div className="legal-content">
                    <LegalBlocks blocks={INTRO_BLOCKS} />
                </div>

                <div>
                    <nav aria-label="Terms and Conditions contents" className="legal-toc mb-8 py-5 px-6">
                        <ul className="gap-y-2 gap-x-6">
                            {TOC_ITEMS.map(item => <li key={item.id} className="text-sm">
                                <Link href={`#${item.id}`} className="legal-link">{item.title}</Link>
                            </li>)}
                        </ul>
                    </nav>
                    <div className="legal-content">
                        <LegalBlocks blocks={TERMS_BLOCKS} />
                    </div>
                    <p className="text-sm mt-10">
                        <Link href="#top" className="legal-link">Back to top ↑</Link>
                    </p>
                </div>
            </div>
        </section>
    </main>;
};
