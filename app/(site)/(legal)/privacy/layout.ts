import type {Metadata} from "next";
import type {ReactNode} from "react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "How TechKun collects, uses, and protects your data.",
    alternates: {
        canonical: "/privacy",
    },
};

export default function PrivacyLayout({children}: {children: ReactNode}) {
    return children;
}