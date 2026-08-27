import {css} from "@emotion/react";
import React, {useEffect, useRef, useState} from "react";
import TechKunLogo from "@/app/components/techkun-logo";
import {
	calcGeneratorDuration,
	maxGeneratorDuration,
	motion,
	spring
} from "motion/react";
import {generateLinearEasing} from "motion";
import {MotionLink} from "@/app/components/MotionLink";
import {CustomEvents} from "@/app/utils/custom-events";
import {usePathname} from "next/navigation";

const ENTER_DURATION = 0.6;
const EXIT_DURATION = 0.4;

const enterSpringGenerator = spring({
	keyframes: [0, 1],
	visualDuration: ENTER_DURATION,
	bounce: 0.1
});
const calcEnterDuration = Math.min(calcGeneratorDuration(enterSpringGenerator), maxGeneratorDuration);
const enterSpringEasing = generateLinearEasing(
	(progress) => enterSpringGenerator.next(calcEnterDuration * progress).value,
	calcEnterDuration,
	30
);

const exitSpringGenerator = spring({
	keyframes: [0, 1],
	visualDuration: EXIT_DURATION,
	bounce: 0.1
});
const calcExitDuration = Math.min(calcGeneratorDuration(exitSpringGenerator), maxGeneratorDuration);
const exitSpringEasing = generateLinearEasing(
	(progress) => exitSpringGenerator.next(calcExitDuration * progress).value,
	calcExitDuration,
	30
);

enum TextState {
	ENTER = "enter",
	EXIT = "exit",
	VISIBLE = "visible"
}

export default function LogoButton({className, style, ...props}: React.ComponentProps<typeof MotionLink>) {
	const pathname = usePathname();
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
		if (pathname !== "/") {
			const intersectionObserver = new IntersectionObserver(
				entries => {
					if ((textAboveThreshold.current = entries.at(0)?.isIntersecting ?? false)) animateIn();
					else animateOut();
				},
				{ threshold: 0.5 }
			);
			intersectionObserver.observe(document.documentElement);
			return () => intersectionObserver.unobserve(document.documentElement);
		}

		const abortController = new AbortController();
		document.addEventListener(CustomEvents.CTA_ENTER_VIEWPORT, () => {
			textAboveThreshold.current = true;
			animateIn();
		}, { signal: abortController.signal });
		document.addEventListener(CustomEvents.CTA_EXIT_VIEWPORT, () => {
			textAboveThreshold.current = false;
			animateOut();
		}, { signal: abortController.signal });
		return () => abortController.abort();
	}, [pathname]);

	// This would cause hydration errors
	// TODO: Figure out an alternative
	const REM = typeof getComputedStyle !== "undefined" ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 16;
	return <MotionLink
		href="/" layout="size"
		className={"display-text " + className} style={{ borderRadius: (0.75 * REM) + "px", ...style }}
		transition={{
			layout: {
				type: "spring",
				visualDuration: (textState === TextState.EXIT ? EXIT_DURATION + 0.2 : ENTER_DURATION - 0.2),
				bounce: 0.3
			}
		}}
		css={css`
			height: 110%;
			padding-inline: 24px;
			background-color: oklch(from var(--background) 0.15 c h);
			display: flex;
			align-items: center;
			font-weight: 500;
			text-decoration: none;

			//corner-shape: squircle;
			//border-radius: 64px;
			//@supports not (corner-shape: superellipse(2)) {
			//	border-radius: 8px;
			//}
		`}
		onClick={e => {
			if (window.location.pathname !== "/") return;
			e.preventDefault();
			window.scrollTo({top: 0, behavior: "smooth"});
		}}
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
		<motion.span layout="size">
			<TechKunLogo style={{ display: "block" }} />
		</motion.span>
		<motion.span css={css`
			height: 1lh;
			position: relative;
			display: flex;
			align-items: center;
		`}>
			<motion.span
				layout="size"
				css={css`
					pointer-events: none;
					color: transparent;
					background-image: linear-gradient(
						to right in oklch,
						var(--foreground) calc(var(--gradient-progress) - 60%),
						var(--secondary-500) calc(var(--gradient-progress) - 40%),
						var(--primary-500) calc(var(--gradient-progress) - 20%),
						transparent var(--gradient-progress)
					);
					padding-inline-start: 16px;
					background-clip: text;

					transition: --gradient-progress ${calcEnterDuration}ms ${enterSpringEasing};
					--gradient-progress: 160%;

					&[data-state=${TextState.ENTER}] {
						@starting-style {
							--gradient-progress: 0%;
						}
					}
					&[data-state=${TextState.EXIT}] {
						position: absolute;
						transition-timing-function: ${exitSpringEasing};
						transition-duration: ${calcExitDuration}ms;
						--gradient-progress: 0%;
					}
				`}
				data-state={textState}
			>TechKun</motion.span>
		</motion.span>
	</MotionLink>;
};