'use client'
import {css} from "@emotion/react";
import {Easing, mapEasingToNativeEasing, motion} from "motion/react";
import React, {useId} from "react";
import cssSupports from "@/app/utils/css/supports";
import {MotionLink} from "@/app/components/MotionLink";
import {gradientColor1, gradientColor2} from "@/app/utils/css/custom-properties";

const INITIAL = "initial";
const FOCUSED = "focused";
const variants = {
	[INITIAL]: { d: "M 22 7 c 0 -1.6569 -1.3431 -3 -3 -3 l -14 0 c -1.6569 0 -3 1.3431 -3 3 l 0 10 c 0 1.6569 1.3431 3 3 3 l 14 0 c 1.6569 0 3 -1.3431 3 -3 l 0 -10 m 0 1 l -8 4.8 c -2 1.2 -2 1.2 -4 0 l -8 -4.8" },
	[FOCUSED]: { d: "M 22.2168 3.0898 C 22.5577 2.2667 21.7333 1.4423 20.9102 1.7832 L 3.3565 9.0542 C 2.5174 9.4018 2.5388 10.5977 3.3897 10.915 L 9.2457 13.0992 C 10.0609 13.4033 10.704 14.0464 11.0081 14.8616 L 13.1923 20.7176 C 13.5097 21.5685 14.7055 21.5899 15.0531 20.7508 L 22.2168 3.0898 M 22 2 L 10.3186 13.7887 C 10.0145 13.4846 9.6486 13.2495 9.2457 13.0992 L 3.3897 10.915" }
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
					${gradientColor1}: var(--color-brand-1);
					${gradientColor2}: var(--color-brand-3);
					path {
						d: path("${variants[FOCUSED].d}");
					}
				}
			`}
			aria-label={children ? undefined : `Email us at ${address}`}
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