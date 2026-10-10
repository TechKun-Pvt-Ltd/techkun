import React from "react";
import IconLink from "@/components/links/IconLink.tsx";
import Mail from "@/iconography/glyphs/mail";

export default function EmailLink(
	{address, ...props}: {address: string} & Omit<React.ComponentProps<typeof IconLink>, "icon" | "label" | "href">
) {
	return <IconLink icon={Mail} label={`Email us at ${address}`} href={`mailto:${address}`} {...props} />;
};
