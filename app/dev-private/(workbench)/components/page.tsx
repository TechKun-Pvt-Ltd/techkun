"use client";
import {css} from "@emotion/react";
import React from "react";
import IconLink from "@/components/links/IconLink.tsx";
import LogoLinkedin from "@/iconography/glyphs/logo-linkedin";
import LogoX from "@/iconography/glyphs/logo-x";
import Mail from "@/iconography/glyphs/mail";

const pageCss = css`
    display: grid;
    gap: var(--space-8);
    padding: var(--space-8);
`;
const rowCss = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-6);
`;

function Entry({title, children}: {title: string; children: React.ReactNode}) {
	return <section>
		<h2 className="type-heading-md">{title}</h2>
		<div css={rowCss}>{children}</div>
	</section>;
}

// Workbench: every system component in its variants.
export default function ComponentsPage() {
	return <main css={pageCss}>
		<Entry title="IconLink">
			<IconLink icon={Mail} href="mailto:hello@example.com" label="Email" />
			<IconLink icon={Mail} href="mailto:hello@example.com">Icon at start</IconLink>
			<IconLink icon={Mail} href="mailto:hello@example.com" iconPosition="end">Icon at end</IconLink>
			<IconLink icon={Mail} href="mailto:hello@example.com" iconSize="lg" iconStrokeWidth="sm">Size lg, stroke sm</IconLink>
			<IconLink icon={LogoX} href="https://x.com" label="X" external />
			<IconLink icon={LogoLinkedin} href="https://linkedin.com" label="LinkedIn" external />
		</Entry>
	</main>;
}
