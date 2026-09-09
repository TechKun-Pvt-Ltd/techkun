/** @jsxImportSource react */
import type {Metadata} from "next";
import DetailedPrivacyPolicyContent from "@/app/privacy/detailed/DetailedPrivacyPolicyContent";

export const metadata: Metadata = {
    title: "Detailed Privacy Policy — TechKun",
    description: "The full, unabridged text of TechKun's privacy policy, including definitions and region-specific rights."
};

export default function DetailedPrivacyPolicy() {
    return <DetailedPrivacyPolicyContent />;
}
