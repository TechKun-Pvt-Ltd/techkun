/** @jsxImportSource react */
import type {Metadata} from "next";
import SiteChrome from "@/app/(site)/components/SiteChrome.tsx";
import NotFoundContent from "@/app/(site)/components/NotFoundContent.tsx";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function NotFound() {
    return <SiteChrome>
        <NotFoundContent />
    </SiteChrome>;
}
