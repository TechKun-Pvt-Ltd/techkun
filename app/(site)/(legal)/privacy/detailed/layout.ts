import type {Metadata} from "next";
import type {ReactNode} from "react";

export const metadata: Metadata = {
    title: "Detailed Privacy Policy",
    description: "The full, unabridged text of TechKun's privacy policy, including definitions and region-specific rights.",
    alternates: {
        canonical: "/privacy/detailed",
    },
};

export default function DetailedPrivacyLayout({children}: {children: ReactNode}) {
    return children;
}