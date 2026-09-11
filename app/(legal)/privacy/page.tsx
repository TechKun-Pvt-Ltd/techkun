/** @jsxImportSource react */
import type {Metadata} from "next";
import PrivacyPageContent from "@/app/(legal)/privacy/PrivacyPageContent";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "How TechKun collects, uses, and protects your data.",
    alternates: {
        canonical: "/privacy",
    },
};

export default function Privacy() {
    return <PrivacyPageContent />;
}
