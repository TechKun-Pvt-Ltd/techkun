/** @jsxImportSource react */
import type {Metadata} from "next";
import NotFoundContent from "@/app/NotFoundContent";

export const metadata: Metadata = {
    title: "Page Not Found — TechKun",
    description: "The page you're looking for doesn't exist or has been moved."
};

export default function NotFound() {
    return <NotFoundContent />;
}
