'use client';
import {css} from "@emotion/react";
import React, {useImperativeHandle, useRef} from "react";
import PrimaryButton from "@/components/links/PrimaryButton.tsx";
import EmailLink from "@/app/components/EmailLink.tsx";
import LinkedInLink from "@/app/components/LinkedInLink.tsx";
import XLink from "@/app/components/XLink.tsx";
import {callBookingUrl, contactMailAddress, linkedInAccountUrl, xAccountUrl} from "@/app/utils/constants.ts";

const groupCss = css`
    pointer-events: auto;
    display: flex;
    gap: var(--space-3);

    opacity: var(--_switch);
    transition: 0.3s ease;
    transition-property: transform, opacity;

    // "header": slides down out of the sticky header. "bottom-nav": slides up out of the sticky bottom bar,
    // and (unlike the header) spans the full bar width, so its children get pushed to opposite ends.
    &[data-variant="header"] {
        transform: translateY(calc((1 - var(--_switch)) * -150%));
    }
    &[data-variant="bottom-nav"] {
        justify-content: space-between;
        transform: translateY(calc((1 - var(--_switch)) * 150%));
    }
`;
const socialLinksGroupCss = css`
    display: flex;
    align-items: center;
    border-radius: var(--radius-full);
    corner-shape: superellipse(1.1);

    background: var(--color-bg-toolbar);
    backdrop-filter: blur(4px);
    border: 1px solid var(--color-border-toolbar);
    a {
        padding: var(--space-1);
        color: var(--color-text-toolbar);
    }
    .divider {
        width: 1px;
        height: 1em;
        background: var(--color-bg-toolbar-divider);
    }
`;

function SocialLinksGroup() {
	return <div className="type-body-lg py-2 px-5 gap-2" css={socialLinksGroupCss}>
		<XLink className="contact-option" href={xAccountUrl} />
		<div className="divider" />
		<LinkedInLink className="contact-option" href={linkedInAccountUrl} />
		<div className="divider" />
		<EmailLink className="contact-option" address={contactMailAddress} />
	</div>;
}

type ContactOptionsGroupVariant = "header" | "bottom-nav";

export type ContactOptionsGroupHandle = {
	show(): void;
	hide(): void;
};

export default function ContactOptionsGroup(
	{ref, isVisible, variant, className}: {
		ref?: React.Ref<ContactOptionsGroupHandle>;
		isVisible: boolean;
		variant: ContactOptionsGroupVariant;
		className?: string;
	}
) {
	const containerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => {
		function setVisible(visible: boolean) {
			const containerElement = containerRef.current;
			if (!containerElement) return;
			containerElement.inert = !visible;
			containerElement.style.setProperty("--_switch", visible ? "1" : "0");
		}
		return {
			show: () => setVisible(true),
			hide: () => setVisible(false)
		};
	}, []);

	const cta = <PrimaryButton className="contact-option" href={callBookingUrl}>Let's talk</PrimaryButton>;
	const socialLinks = <SocialLinksGroup />;

	return <div
		ref={containerRef}
		className={className}
		style={{'--_switch': isVisible ? "1" : "0"} as React.CSSProperties}
		inert={!isVisible}
		data-variant={variant}
		css={groupCss}
	>
		{variant === "header" ? <>{socialLinks}{cta}</> : <>{cta}{socialLinks}</>}
	</div>;
}
