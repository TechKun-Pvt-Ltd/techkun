import Link from "next/link";
import React from "react";
import LogoLinkedin from "@/iconography/glyphs/logo-linkedin";
import SVGBrandGradient from "@/iconography/gradients/SVGBrandGradient";

export default function LinkedInLink({className, ...props}: React.ComponentProps<typeof Link>) {
    return <Link
        target="_blank" rel="noopener noreferrer"
        aria-label="Find us on LinkedIn"
        className={[SVGBrandGradient.host, className].filter(Boolean).join(" ")}
        {...props}
    >
        <LogoLinkedin style={{ display: "block" }} />
    </Link>
}