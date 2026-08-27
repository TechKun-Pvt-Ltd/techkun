'use client'
import {css} from "@emotion/react";
import {Easing, mapEasingToNativeEasing, motion} from "motion/react";
import React, {useId} from "react";
import cssSupports from "@/app/utils/css-supports";
import {MotionLink} from "@/app/components/MotionLink";
import {gradientColor1, gradientColor2} from "@/app/utils/custom-properties";

const INITIAL = "initial";
const FOCUSED = "focused";
const variants = {
	[INITIAL]: { d: "M 22 7 C 22 5.3431 20.6569 4 19 4 L 5 4 C 3.3431 4 2 5.3431 2 7 L 2 17 C 2 18.6569 3.3431 20 5 20 L 19 20 C 20.6569 20 22 18.6569 22 17 L 22 7 M 22 8 L 14 12.8 C 12 14 12 14 10 12.8 L 2 8" },
	[FOCUSED]: { d: "M 21.5 2.75 c 0 0 0 0 0 0 l -17.9705 6.1693 c -0.8712 0.2991 -0.909 1.5172 -0.058 1.8697 l 6.9291 2.8701 c 0 0 0 0 0 0 l 2.7499 6.9777 c 0.3377 0.857 1.5563 0.8403 1.8704 -0.0256 l 6.4791 -17.8612 m 0 0 l -11.0994 10.9091 c 0 0 0 0 0 0 l -6.9291 -2.8701" }
};
const transition: {
	duration: number;
	easing: Easing;
} = {
	duration: 0.3,
	easing: [0.215, 0.61, 0.355, 1]
};

export default function EmailLink(
	{address, children, iconSize = "1em", iconSide = "left", gap = "10px", iconStrokeWidth = 1.6, ...props}: {
		address: string;
		children?: string;
		iconSize?: string | number;
		iconSide?: "left" | "right";
		iconStrokeWidth?: string | number;
		gap?: string;
	} & React.ComponentProps<typeof MotionLink>
) {
	const id = useId();
	const gradientId = "email-link-fill-gradient" + id;

	const icon = <svg
		width={iconSize} viewBox="0 0 24 24"
		className="link-icon"
		style={{
			display: children ? undefined : "block",
			[iconSide === "left" ? "marginInlineEnd" : "marginInlineStart"]: children ? gap : "0",
			verticalAlign: `calc(-1 * (${typeof iconSize === "number" ? iconSize + "px" : iconSize} / 2 - 0.5cap))`
		}}
	>
		<defs>
			<linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="100%">
				<stop offset="20%" stopColor={`var(${gradientColor1})`} />
				<stop offset="80%" stopColor={`var(${gradientColor2})`} />
			</linearGradient>
		</defs>
		<motion.path
			d={variants[INITIAL].d} fill="transparent"
			stroke="currentColor" strokeWidth={iconStrokeWidth} strokeLinejoin="round" strokeLinecap="round"
		 	{...(cssSupports.d ? null : { variants, transition })}
		></motion.path>
	</svg>;

	return <>
		<MotionLink
			href={`mailto:${address}`}
			css={css`
				cursor: pointer;
				text-decoration: none;
				${gradientColor1}: currentColor;
				${gradientColor2}: currentColor;
				transition-property: ${gradientColor1}, ${gradientColor2};

				& path {
					transition-property: d;
					stroke: url(#${gradientId});
				}
				&, & path {
					transition-duration: ${transition.duration}s;
					transition-timing-function: ${mapEasingToNativeEasing(transition.easing, transition.duration)};
				}

				&:hover, &:focus-visible {
					${gradientColor1}: var(--primary-500);
					${gradientColor2}: var(--tertiary-500);
					path {
						d: path("${variants[FOCUSED].d}");
					}
				}
			`}
			{...props}
			initial={INITIAL}
			whileHover={FOCUSED} whileFocus={FOCUSED} whileTap={FOCUSED}
		>
			{iconSide === "left" && icon}
			<span>{children}</span>
			{iconSide === "right" && icon}
		</MotionLink>
	</>
};