/** @jsxImportSource react */
import type {Metadata} from "next";
import TermsPageContent from "@/app/terms/TermsPageContent";

export const metadata: Metadata = {
    title: "Terms and Conditions — TechKun",
    description: "The terms and conditions governing your use of TechKun's services."
};

export default function Terms() {
    return <TermsPageContent />;
}
