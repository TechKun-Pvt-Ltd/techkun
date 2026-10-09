'use client'
import {css} from "@emotion/react";
import React from "react";
import {MotionLink} from "@/app/components/MotionLink";
import {gradientColor1, gradientColor2} from "@/app/utils/css/custom-properties";
import type {IconProps} from "@/iconography/create-icon";
import Mail from "@/iconography/glyphs/mail";

const transition: {
	duration: number;
	easing: string;
} = {
	duration: 0.3,
	easing: "var(--ease-out-cubic)"
};

export default function EmailLink(
	{address, children, iconSize, iconSide = "left", gap = "10px", iconStrokeWidth = 1.6, className, ...props}: {
		address: string;
		children?: string;
		iconSize?: IconProps<never>["size"];
		iconSide?: "left" | "right";
		// In grid units of the 24-unit canvas.
		iconStrokeWidth?: string | number;
		gap?: string;
	} & React.ComponentProps<typeof MotionLink>
) {
	const icon = <Mail
		size={iconSize}
		style={{
			display: children ? undefined : "block",
			[iconSide === "left" ? "marginInlineEnd" : "marginInlineStart"]: children ? gap : "0"
		}}
	/>;

	return <>
		<MotionLink
			href={`mailto:${address}`}
			className={[Mail.host, className].filter(Boolean).join(" ")}
			css={css`
				cursor: pointer;
				--icon-stroke: ${iconStrokeWidth};
				text-decoration: none;
				${gradientColor1}: currentColor;
				${gradientColor2}: currentColor;
				transition-property: ${gradientColor1}, ${gradientColor2};
				transition-duration: ${transition.duration}s;
				transition-timing-function: ${transition.easing};

				&:hover, &:focus-visible {
					${gradientColor1}: var(--color-brand-1);
					${gradientColor2}: var(--color-brand-3);
				}
			`}
			aria-label={children ? undefined : `Email us at ${address}`}
			{...props}
			// Drives the glyph's motion fallback where CSS `d` transitions aren't supported.
			{...Mail.motionHost}
		>
			{iconSide === "left" && icon}
			<span>{children}</span>
			{iconSide === "right" && icon}
		</MotionLink>
	</>
};
