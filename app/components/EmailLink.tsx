'use client'
import {css} from "@emotion/react";
import {Easing, mapEasingToNativeEasing, motion} from "motion/react";
import React, {useId} from "react";
import cssSupports from "@/app/utils/css-supports";
import {MotionLink} from "@/app/components/MotionLink";

const INITIAL = "initial";
const FOCUSED = "focused";
const variants = {
	[INITIAL]: { d: "M 22 6 C 22 4.8954 21.1046 4 20 4 L 4 4 C 2.8954 4 2 4.8954 2 6 L 2 18 C 2 19.1046 2.8954 20 4 20 L 20 20 C 21.1046 20 22 19.1046 22 18 L 22 6 L 12 14 L 2 6" },
	[FOCUSED]: { d: "M 22 2 C 22 2 22 2 22 2 L 4.0295 8.1693 C 3.1583 8.4684 3.1205 9.6865 3.9715 10.039 L 10.9006 12.9091 C 10.9006 12.9091 10.9006 12.9091 10.9006 12.9091 L 13.6505 19.8868 C 13.9882 20.7438 15.2068 20.7271 15.5209 19.8612 L 22 2 L 10.9006 12.9091 L 3.9715 10.039" }
};
const transition: {
	duration: number;
	easing: Easing;
} = {
	duration: 0.3,
	easing: [0.215, 0.61, 0.355, 1]
};

const gradientColor1Prop = "--_gradient-color-1";
const gradientColor2Prop = "--_gradient-color-2";

export default function EmailLink(
	{address, text, iconSide = "left", gap = "10px", iconStrokeWidth = 1, ...props}: {
		address: string;
		text: string;
		iconSide?: "left" | "right";
		iconStrokeWidth?: string | number;
		gap?: string;
	} & React.ComponentProps<typeof MotionLink>
) {
	const id = useId();
	const gradientId = "email-link-gradient" + id;

	const icon = <svg
		height="1em" viewBox="0 0 24 24"
		style={{
			[iconSide === "left" ? "marginInlineEnd" : "marginInlineStart"]: gap,
			verticalAlign: '-0.18em'
		}}
	>
		<defs>
			<linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="100%">
				<stop offset="0%" stopColor={`var(${gradientColor1Prop})`} />
				<stop offset="40%" stopColor={`var(${gradientColor1Prop})`} />
				<stop offset="60%" stopColor={`var(${gradientColor2Prop})`} />
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
				@property ${gradientColor1Prop} {
					syntax: "<color>";
					inherits: true;
					initial-value: currentColor;
				}
				@property ${gradientColor2Prop} {
					syntax: "<color>";
					inherits: true;
					initial-value: currentColor;
				}

				cursor: pointer;
				text-decoration: none;
				${gradientColor1Prop}: currentColor;
				${gradientColor2Prop}: currentColor;
				transition-property: ${gradientColor1Prop}, ${gradientColor2Prop};

				& path {
					transition-property: d;
					stroke: url(#${gradientId});
				}
				&, & path {
					transition-duration: ${transition.duration}s;
					transition-timing-function: ${mapEasingToNativeEasing(transition.easing, transition.duration)};
				}

				&:hover, &:focus-visible {
					${gradientColor1Prop}: var(--primary-500);
					${gradientColor2Prop}: var(--tertiary-500);
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