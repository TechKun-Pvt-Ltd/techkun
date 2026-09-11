import type {Metadata} from "next";
import type {ReactNode} from "react";

export const metadata: Metadata = {
    title: "Terms and Conditions",
    description: "The terms and conditions governing your use of TechKun's services.",
    alternates: {
        canonical: "/terms",
    },
};

export default function TermsLayout({children}: {children: ReactNode}) {
    return children;
}