import React from "react";
import IconLink from "@/components/links/IconLink.tsx";
import LogoLinkedin from "@/iconography/glyphs/logo-linkedin";

export default function LinkedInLink(props: Omit<React.ComponentProps<typeof IconLink>, "icon" | "label" | "external">) {
    return <IconLink icon={LogoLinkedin} label="Find us on LinkedIn" external {...props} />;
}
