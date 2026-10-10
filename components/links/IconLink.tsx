'use client';
import {css} from "@emotion/react";
import React from "react";
import {MotionLink} from "@/app/components/MotionLink";
import type {IconProps} from "@/iconography/create-icon";
import type {motionHost} from "@/iconography/host-bindings";
import SVGBrandGradient from "@/iconography/gradients/SVGBrandGradient";

// A glyph component, with the host bindings it may carry.
type IconComponent = React.ComponentType<IconProps<never>> & {
	host?: string;
	motionHost?: ReturnType<typeof motionHost>;
};

const linkCss = css`
    cursor: pointer;
    text-decoration: none;
`;

export default function IconLink(
	{
		icon: Icon, label, external, children,
		iconPosition = "start", iconSize, iconStrokeWidth = 1.6, gap = "10px",
		className, ...props
	}: {
		icon: IconComponent;
		// The accessible name when there's no text.
		label?: string;
		// Opens in a new tab.
		external?: boolean;
		children?: React.ReactNode;
		iconPosition?: "start" | "end";
		iconSize?: IconProps<never>["size"];
		// In grid units of the 24-unit canvas.
		iconStrokeWidth?: IconProps<never>["strokeWidth"];
		gap?: string;
	} & React.ComponentProps<typeof MotionLink>
) {
	const icon = <Icon
		size={iconSize}
		strokeWidth={iconStrokeWidth}
		style={{
			display: children ? undefined : "block",
			[iconPosition === "start" ? "marginInlineEnd" : "marginInlineStart"]: children ? gap : "0"
		}}
	/>;

	return <MotionLink
		className={[Icon.host, SVGBrandGradient.host, className].filter(Boolean).join(" ")}
		css={linkCss}
		aria-label={children ? undefined : label}
		{...(external ? {target: "_blank", rel: "noopener noreferrer"} : null)}
		{...props}
		// Drives the glyph's motion fallback where CSS `d` transitions aren't supported.
		{...Icon.motionHost}
	>
		{iconPosition === "start" && icon}
		{children && <span>{children}</span>}
		{iconPosition === "end" && icon}
	</MotionLink>;
}
