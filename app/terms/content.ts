export const LAST_UPDATED = "August 15, 2026";

export type LegalBlock =
    | { type: "heading"; level: 3 | 4; text: string; id?: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "fields"; items: { label: string; value: string }[] }
    | { type: "email"; address: string; label?: string };

export const TOC_ITEMS: { id: string; title: string }[] = [
    { id: "section-1", title: "Acceptance of Terms" },
    { id: "section-2", title: "Use of the Website" },
    { id: "section-3", title: "Intellectual Property Rights" },
    { id: "section-4", title: "Third-Party Links and Services" },
    { id: "section-5", title: "Disclaimer" },
    { id: "section-6", title: "Limitation of Liability" },
    { id: "section-7", title: "Indemnification" },
    { id: "section-8", title: "Changes to These Terms" },
    { id: "section-9", title: "Governing Law and Jurisdiction" },
    { id: "section-10", title: "Accessibility Statement" },
    { id: "section-11", title: "Contact Information" }
];

export const INTRO_BLOCKS: LegalBlock[] = [
    { type: "p", text: "TechKun is a technology-first IT services company focused on building software applications and delivering software services in accordance with established industry standards, without compromising on quality. This Website exists to present clear, accurate, and transparent information about our work, our practices, and the services we provide." },
    { type: "p", text: "This Website has been designed and developed entirely by TechKun—from written content and visual assets to animations and structure—to demonstrate our technical capabilities, design standards, and working approach. Artificial intelligence tools were used solely for proofreading and recursive assistance; all substantive work, decisions, and execution reflect direct human effort and professional judgment." },
    { type: "p", text: "Access to this Website is open to all individuals, without discrimination based on caste, sex, gender, ethnicity, body size, body shape, color, or background. TechKun operates on strict principles of equality, respect, and professional integrity. Discrimination, harassment, racism, sexism, or exclusionary conduct of any kind is not tolerated within our organization or in connection with the use of this Website. We are committed to maintaining a safe, respectful, and peaceful environment and expect all Users to engage with this Website responsibly and in good faith." },
    { type: "p", text: "This Website is provided strictly for informational, educational, and acknowledgment purposes. It is not intended for misuse, misrepresentation, unlawful activity, unrealistic expectations, or claims beyond what is explicitly stated." }
];

export const TERMS_BLOCKS: LegalBlock[] = [
    { type: "heading", level: 3, text: "1. Acceptance of Terms", id: "section-1" },
    { type: "ul", items: [
        "Accessing or using this Website means you agree to these Terms and Conditions",
        "If you do not agree, you must stop using the Website",
        "Continued use after updates means acceptance of revised Terms"
    ] },

    { type: "heading", level: 3, text: "2. Use of the Website", id: "section-2" },
    { type: "ul", items: [
        "Use the Website only for lawful and legitimate purposes",
        "Do not misuse, disrupt, or attempt to compromise Website security",
        "Do not scrape, copy, or exploit content without permission",
        "Do not introduce malicious code, bots, or automated tools"
    ] },

    { type: "heading", level: 3, text: "3. Intellectual Property Rights", id: "section-3" },
    { type: "ul", items: [
        "All content on this Website belongs to TechKun unless stated otherwise",
        "This includes text, visuals, graphics, animations, layout, and code",
        "No reproduction, distribution, or commercial use without written permission"
    ] },

    { type: "heading", level: 3, text: "4. Third-Party Links and Services", id: "section-4" },
    { type: "ul", items: [
        "The Website may include links to third-party websites",
        "TechKun does not control or endorse third-party content or policies",
        "Visiting third-party links is done at your own risk"
    ] },

    { type: "heading", level: 3, text: "5. Disclaimer", id: "section-5" },
    { type: "ul", items: [
        "Content is provided for general informational purposes only",
        "Information is provided “as is” and “as available”",
        "No warranties are made regarding accuracy, completeness, or availability",
        "Content may change without notice"
    ] },

    { type: "heading", level: 3, text: "6. Limitation of Liability", id: "section-6" },
    { type: "ul", items: [
        "TechKun is not liable for damages arising from Website use",
        "This includes direct, indirect, incidental, or consequential damages",
        "Use of the Website is at your own risk"
    ] },

    { type: "heading", level: 3, text: "7. Indemnification", id: "section-7" },
    { type: "ul", items: [
        "You agree to indemnify and hold TechKun harmless from claims",
        "This includes claims arising from misuse or violation of these Terms"
    ] },

    { type: "heading", level: 3, text: "8. Changes to These Terms", id: "section-8" },
    { type: "ul", items: [
        "TechKun may update these Terms at any time",
        "Updates become effective once published on this page",
        "Continued use implies acceptance of changes"
    ] },

    { type: "heading", level: 3, text: "9. Governing Law and Jurisdiction", id: "section-9" },
    { type: "ul", items: [
        "These Terms are governed by the laws of India",
        "Any disputes fall under the Bhopal jurisdiction"
    ] },

    { type: "heading", level: 3, text: "10. Accessibility Statement", id: "section-10" },
    { type: "heading", level: 4, text: "Our Commitment to Accessibility" },
    { type: "p", text: "TechKun believes that digital experiences should be usable and understandable by as many people as reasonably possible, regardless of device or ability. We aim to design and develop this Website with accessibility, clarity, and usability in mind as part of our broader commitment to quality and responsible software practices." },
    { type: "p", text: "While this Website may not yet fully conform to all accessibility standards or guidelines, we are continuously working to improve its structure, content, and usability. Accessibility is treated as an ongoing process rather than a one-time certification." },
    { type: "p", text: "If you encounter any accessibility barriers while using this Website, we encourage you to contact us. Reasonable efforts will be made to review and address concerns where feasible." },
    { type: "email", address: "info@tech-kun.com", label: "Report an accessibility issue: info@tech-kun.com" },

    { type: "heading", level: 3, text: "11. Contact Information", id: "section-11" },
    { type: "fields", items: [
        { label: "Company", value: "TechKunEx Digital Solutions Pvt. Ltd." },
        { label: "Address", value: "28, Royal Market, Bhopal, MP, India – 462001" }
    ] },
    { type: "email", address: "info@tech-kun.com", label: "Email: info@tech-kun.com" }
];
