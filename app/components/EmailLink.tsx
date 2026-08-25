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
	[FOCUSED]: { d: "M 22 2 C 22 2 22 2 22 2 L 4.0295 8.1693 C 3.1583 8.4684 3.1205 9.6865 3.9715 10.039 L 10.9006 12.9091 C 10.9006 12.9091 10.9006 12.9091 10.9006 12.9091 L 13.6505 19.8868 C 13.9882 20.7438 15.2068 20.7271 15.5209 19.8612 L 22 2 M 22 2 L 10.9006 12.9091 C 10.9006 12.9091 10.9006 12.9091 10.9006 12.9091 L 3.9715 10.039" }
};
const transition: {
	duration: number;
	easing: Easing;
} = {
	duration: 0.3,
	easing: [0.215, 0.61, 0.355, 1]
};

export default function EmailLink(
	{address, text, iconSize = "1em", iconSide = "left", gap = "10px", iconStrokeWidth = 1.6, ...props}: {
		address: string;
		text: string;
		iconSize?: string | number;
		iconSide?: "left" | "right";
		iconStrokeWidth?: string | number;
		gap?: string;
	} & React.ComponentProps<typeof MotionLink>
) {
	const id = useId();
	const gradientId = "email-link-fill-gradient" + id;

	const icon = <svg
		height={iconSize} viewBox="0 0 24 24"
		style={{
			[iconSide === "left" ? "marginInlineEnd" : "marginInlineStart"]: gap,
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
			<span>{text}</span>
			{iconSide === "right" && icon}
		</MotionLink>
	</>
};