import Link from "next/link";
import React from "react";
import LogoX from "@/iconography/glyphs/logo-x";
import SVGBrandGradient from "@/iconography/gradients/SVGBrandGradient";

export default function XLink({className, ...props}: React.ComponentProps<typeof Link>) {
    return <Link
        target="_blank" rel="noopener noreferrer"
        aria-label="Find us on X"
        className={[SVGBrandGradient.host, className].filter(Boolean).join(" ")}
        {...props}
    >
        <LogoX style={{ display: "block" }} />
    </Link>
}