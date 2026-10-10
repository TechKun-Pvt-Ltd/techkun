import React from "react";
import IconLink from "@/components/links/IconLink.tsx";
import LogoX from "@/iconography/glyphs/logo-x";

export default function XLink(props: Omit<React.ComponentProps<typeof IconLink>, "icon" | "label" | "external">) {
    return <IconLink icon={LogoX} label="Find us on X" external {...props} />;
}
