'use client'
import {css} from "@emotion/react";
import React from "react";
import {MotionLink} from "@/app/components/MotionLink";
import type {IconProps} from "@/iconography/create-icon";
import Mail from "@/iconography/glyphs/mail";
import SVGBrandGradient from "@/iconography/gradients/SVGBrandGradient";

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
			className={[Mail.host, SVGBrandGradient.host, className].filter(Boolean).join(" ")}
			css={css`
				cursor: pointer;
				--icon-stroke: ${iconStrokeWidth};
				text-decoration: none;
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
