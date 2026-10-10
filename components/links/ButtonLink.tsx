'use client';
import {css} from "@emotion/react";
import React from "react";
import {MotionLink} from "@/app/components/MotionLink";
import type {IconComponent} from "@/components/links/IconLink.tsx";

const linkCss = css`
    display: inline-block;
    text-decoration: none;
    background: transparent;
    padding-block: 0.75rem;
    padding-inline: 1.6em 1.4em;
    //border-radius: 0.75rem;
    border-radius: var(--radius-full);
    corner-shape: superellipse(1.1);
    //font-weight: var(--font-weight-semibold);

    //&::before, &::after {
    //    border: 1px solid transparent;
    //}

    & > svg {
        margin-inline-start: 0.4375em;
    }
`;

export default function ButtonLink(
	{icon: Icon, external, children, className, ...props}: {
		// Trails the label.
		icon: IconComponent;
		// Opens in a new tab.
		external?: boolean;
		children: React.ReactNode;
	} & React.ComponentProps<typeof MotionLink>
) {
	return <MotionLink
		className={["bi-layered-button", Icon.host, className].filter(Boolean).join(" ")}
		css={linkCss}
		{...(external ? {target: "_blank", rel: "noopener noreferrer"} : null)}
		// Drives the glyph's motion fallback where CSS `d` transitions aren't supported.
		{...Icon.motionHost}
		{...props}
	>
		{children}
		{/* The stroke, in grid units, matched to the label's weight. */}
		<Icon size="0.6em" strokeWidth={3.5} />
	</MotionLink>;
}
