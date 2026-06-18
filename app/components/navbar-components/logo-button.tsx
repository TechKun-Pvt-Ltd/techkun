import {css} from "@emotion/react";
import React, {useEffect, useRef, useState} from "react";
import TechKunLogo from "@/app/components/techkun-logo";
import {
	AnimatePresence,
	calcGeneratorDuration,
	maxGeneratorDuration,
	motion,
	spring,
	visualElementStore
} from "motion/react";
import {generateLinearEasing} from "motion";

const springGenerator = spring(undefined, 0.1);
const calculatedDuration = Math.min(calcGeneratorDuration(springGenerator), maxGeneratorDuration);
const springLinearEasing = generateLinearEasing(
	(progress) => springGenerator.next(calculatedDuration * progress).value,
	calculatedDuration,
	30
);

const EXIT_DURATION = 0.4;

enum TextState {
	ENTER = "enter",
	EXIT = "exit",
	VISIBLE = "visible"
}

export default function LogoButton({className, style, ...props}: React.ComponentProps<typeof motion.button>) {
	const textElement = useRef<HTMLSpanElement>(null);
	const textHovered = useRef(false);
	const textAboveThreshold = useRef(true);
	const [textState, setTextState] = useState<TextState>(TextState.VISIBLE);

	function animateIn() {
		setTextState(TextState.ENTER);
	}
	function animateOut() {
		// the text element cannot be animated out by other events if it's hovered or above the threshold.
		if (textAboveThreshold.current || textHovered.current) return;
		setTextState(TextState.EXIT);
	}

	useEffect(() => {
		function onScroll() {
			const aboveThreshold = window.scrollY <= window.innerHeight / 2;
			if (textAboveThreshold.current === aboveThreshold) return;

			if ((textAboveThreshold.current = aboveThreshold)) animateIn();
			else animateOut();
		}
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.addEventListener("scroll", onScroll);
	}, []);

	return <motion.button
		layout
		className={"display-text " + className}
		style={{ borderRadius: "16px", ...style }}
		transition={textState === TextState.EXIT ? { duration: EXIT_DURATION + 0.1 }: undefined}
		css={css`
			padding-block: 16px;
			padding-inline: 24px;
			background-color: oklch(from var(--background) 0.14 c h);
			display: flex;
			align-items: center;
			font-weight: 500;

			//corner-shape: squircle;
			//border-radius: 64px;
			//@supports not (corner-shape: superellipse(2)) {
			//	border-radius: 8px;
			//}
		`}
		onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
		{...props}
		onHoverStart={_ => {
			textHovered.current = true;
			animateIn();
		}}
		onHoverEnd={_ => {
			textHovered.current = false;
			animateOut();
		}}
	>
		<motion.span layout>
			<TechKunLogo style={{ display: "block" }} />
		</motion.span>
		<motion.span css={css`
			height: 1lh;
			position: relative;
			display: flex;
			align-items: center;
		`}>
			<motion.span
				ref={textElement}
				layout
				css={css`
					pointer-events: none;
					color: transparent;
					background-image: linear-gradient(
						to right in oklch,
						var(--foreground) 33.33%,
						var(--secondary-500),
						var(--primary-500),
						transparent 66.66%
					);
					padding-inline-start: 16px;
					background-size: 300% 100%;
					background-clip: text;
					background-position-y: 50%;
	
					transition: background-position-x 0.6s ease-in-out;
					background-position-x: 0;
					&[data-state=${TextState.ENTER}] {
						@starting-style {
							background-position-x: 100%;
						}
					}
					&[data-state=${TextState.EXIT}] {
						position: absolute;
						transition-timing-function: ${springLinearEasing};
						transition-duration: ${EXIT_DURATION}s;
						background-position-x: 100%;
					}
				`}
				data-state={textState}
			>TechKun</motion.span>
		</motion.span>
	</motion.button>;
};