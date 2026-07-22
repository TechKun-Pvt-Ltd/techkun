import React, {forwardRef, useImperativeHandle} from "react";
import {css, keyframes} from "@emotion/react";
import {motion} from "motion/react";
import {useFollowPointer} from "@/hooks/use-follow-pointer";
import BANNER_ANIMATION from "@/app/animations/banner";

const { delay, duration } = BANNER_ANIMATION.wordGradientFill;
const gradientFill = keyframes`
	0% {
		--gradient-progress: -25%;
	}
	100% {
		--gradient-progress: 100%;
	}
`;
const DEFAULT_CENTER: [number, number] = [0.55, 0.9];

export type BeautyRef = {
	play(): void;
};

export default forwardRef<BeautyRef, React.ComponentPropsWithoutRef<typeof motion.span>>(function Beauty(
	{style, ...props}, ref
) {
	const {x, y, containerRef} = useFollowPointer({ defaultPosition: DEFAULT_CENTER });

	useImperativeHandle(ref, () => ({
		play() {
			containerRef.current?.setAttribute("data-play", "true");
		}
	}), []);

	return <motion.span
		ref={containerRef}
		style={{
			...style,
			'--center-x': x,
			'--center-y': y
		} as React.CSSProperties}
		{...props}
		css={css`
			color: transparent;
			background-image: radial-gradient(
				circle at calc(var(--center-x) * 100%) calc(var(--center-y) * 100%),
				var(--secondary-300) calc(var(--gradient-progress) / 4),
				var(--secondary-500) calc(var(--gradient-progress) / 4),
				var(--primary-500) var(--gradient-progress),
				transparent calc(var(--gradient-progress) + 25%)
			);
			background-color: var(--neutral-700);
			background-clip: text;
			animation: ${gradientFill} ${duration}s ${delay}s ease-out both;
			animation-play-state: paused;
			&[data-play="true"] {
				animation-play-state: running;
			}
		`}
	>beauty</motion.span>;
})
