'use client';
import {css} from "@emotion/react";
import React, {useRef} from "react";
import MainCTA from "@/app/components/MainCTA.tsx";
import EmailLink from "@/app/components/EmailLink.tsx";
import LinkedInLink from "@/app/components/LinkedInLink.tsx";
import XLink from "@/app/components/XLink.tsx";
import {contactMailAddress, linkedInAccountUrl, xAccountUrl} from "@/app/utils/constants.ts";
import useContactOptionsSwitch from "@/app/components/contact-options/use-contact-options-switch.ts";

const baseGroupCss = css`
    pointer-events: auto;
    display: flex;
    gap: var(--space-3);

    opacity: var(--_switch);
    transition: 0.3s ease;
    transition-property: transform, opacity;
`;
// "header": slides down out of the sticky header. "bottom-nav": slides up out of the sticky bottom bar,
// and (unlike the header) spans the full bar width, so its children get pushed to opposite ends.
const variantCss = {
	header: css`
        transform: translateY(calc((1 - var(--_switch)) * -150%));
    `,
	"bottom-nav": css`
        justify-content: space-between;
        transform: translateY(calc((1 - var(--_switch)) * 150%));
    `
};
const socialLinksGroupCss = css`
    display: flex;
    align-items: center;
    border-radius: 100vh;
    corner-shape: superellipse(1.1);

    background: oklch(from var(--secondary-950) l c h / 0.96);
    backdrop-filter: blur(4px);
    border: 1px solid var(--secondary-900);
	padding-block: 0.5rem;
	padding-inline: 1.4rem;
	gap: 0.5rem;
    a {
        padding: var(--space-1);
        color: var(--secondary-neutral-400);
    }
    .divider {
        width: 1px;
        height: 1em;
        background: var(--secondary-900);
    }
`;

function SocialLinksGroup() {
	return <div className="text-lg" css={socialLinksGroupCss}>
		<XLink className="contact-option" href={xAccountUrl} />
		<div className="divider" />
		<LinkedInLink className="contact-option" href={linkedInAccountUrl} />
		<div className="divider" />
		<EmailLink className="contact-option" address={contactMailAddress} />
	</div>;
}

type ContactOptionsGroupVariant = keyof typeof variantCss;

export default function ContactOptionsGroup(
	{isHomepage, variant, className}: {
		isHomepage: boolean;
		variant: ContactOptionsGroupVariant;
		className?: string;
	}
) {
	const containerRef = useRef<HTMLDivElement>(null);
	useContactOptionsSwitch(containerRef, isHomepage);

	const cta = <MainCTA className="contact-option">Let's talk</MainCTA>;
	const socialLinks = <SocialLinksGroup />;

	return <div
		ref={containerRef}
		className={className}
		style={{'--_switch': isHomepage ? "0" : "1"} as React.CSSProperties}
		css={[baseGroupCss, variantCss[variant]]}
	>
		{variant === "header" ? <>{socialLinks}{cta}</> : <>{cta}{socialLinks}</>}
	</div>;
}
