import React, {useEffect, useId, useState} from "react";
import {motion} from "motion/react";
import {animate, delayInSeconds, SpringOptions} from "motion";
import {css} from "@emotion/react";
import {useFollowPointer} from "@/hooks/use-follow-pointer";
import {useBrowser} from "@/hooks/use-browser";
import {type FontMetrics, measureFont} from "@/app/utils/measure-font";
import {frame} from "motion-dom";
import BANNER_ANIMATION from "@/app/animations/banner";

const xHeightIndicatorStart = 16;
const capHeightIndicatorStart = 68;

const springOptions: SpringOptions = {stiffness: 500, damping: 30};
const DEFAULT_CENTER: [number, number] = [0.786, 0.59];
const xBounds: [number, number] = [0, 1];

export default function Precision(props: React.ComponentPropsWithoutRef<"span">) {
	const id = useId();
	const browser = useBrowser();

	const [metrics, setMetrics] = useState<FontMetrics | null>(null);

	const clipId = "clip-" + id;
	const maskId = "mask-" + id;
	const circleId = "circle-" + id;
	const {x, y, containerRef} = useFollowPointer({ defaultPosition: DEFAULT_CENTER, springOptions, xBounds });

	useEffect(() => {
		delayInSeconds(() => {
			const value = y.get();
			if (value === DEFAULT_CENTER[1])
				animate(y, [value, value - 0.2, value], { ease: "easeIn" });
		}, BANNER_ANIMATION.precision.delay);
	}, []);
	useEffect(() => {
		if (browser.isNone || !containerRef.current) return;

		let styles: CSSStyleDeclaration;
		let lastFont: string;
		function updateMetrics() {
			if (!styles)
				styles = getComputedStyle(containerRef.current!);
			const font = styles.font;
			if (font === lastFont)
				return;
			lastFont = font;
			measureFont(font).then(setMetrics);
		}
		function listener() {
			frame.setup(updateMetrics);
		}
		listener();
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	}, [browser]);

	return <span
		{...props}
		css={css`
			position: relative;
			//z-index: 0;
			color: var(--foreground);
			// &::before {
			// 	content: "";
			// 	position: absolute;
			// 	top: 0; left: 0;
			// 	height: 100%;
			// 	width: {xBounds[1] * 100}%;
			// }
		`}
		ref={containerRef}
	>
		precisi<span style={{opacity: 0.2}}>o</span>n
		<motion.span
			style={{"--x": x, "--y": y} as React.CSSProperties}
			css={css`
				@property --r {
					syntax: "<length-percentage>";
					inherits: true;
					initial-value: 0;
				}
				position: absolute;
				inset: 0;
				--r: 0.24em;
				&:hover {
					--r: 0.72em;
				}
			`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				css={css`
					width: 100%;
					height: 100%;
					overflow: visible;
				`}
				strokeLinecap="round"
			>
				<defs>
					<circle
						id={circleId}
						cx="0" cy="0"
						css={css`
							r: var(--r);
							transition: --r 0.2s ease-in-out;
							transform-box: view-box;
							transform: translate(calc(var(--x) * 100%), calc(var(--y) * 100%));
						`}
					/>
					<mask id={maskId}>
						<rect width="100%" height="100%" fill="white"></rect>
						<use href={`#${circleId}`} fill="oklch(0.5 0 0)"></use>
					</mask>
					<clipPath id={clipId}>
						<use href={`#${circleId}`}></use>
					</clipPath>
				</defs>
				<g clipPath={`url(#${clipId})`}>
					{browser.isSafari ?
						<foreignObject x="0" y="0" width="100%" height="100%">
							<span
								xmlns="http://www.w3.org/1999/xhtml"
								css={css`
									color: var(--neutral-800);
									height: 100%;
                                    display: flex;
                                    align-items: center;
									-webkit-text-stroke: 2px var(--neutral-800);
								`}
							>
								precision
							</span>
						</foreignObject> :
						<text
							y="1em"
							fill="var(--neutral-800)"
							stroke="var(--neutral-800)"
							strokeWidth="2"
						>
							precision
						</text>
					}
					{metrics && <g fill="var(--neutral-600)">
						<text
							className="body-text"
							x={`${xHeightIndicatorStart + 1}%`}
							y={metrics.xHeight - 8}
						>x-height</text>
						<text
							className="body-text"
							x={`${capHeightIndicatorStart + 1}%`}
							y={metrics.capHeight - 8}
						>cap height</text>
						<text
							className="body-text"
							x={`30%`}
							y={metrics.descender}
						>baseline</text>
					</g>}
					{metrics && <g
						stroke="var(--neutral-400)"
						strokeWidth="1"
					>
						<line
							x1="0%"
							x2="100%"
							y1={metrics.baseline}
							y2={metrics.baseline}
							strokeDasharray="10"
						/>

						<line
							x1={`${xHeightIndicatorStart - 2}%`}
							x2={`${xHeightIndicatorStart + 2}%`}
							y1={metrics.baseline}
							y2={metrics.baseline}
						/>
						<line
							x1={`${xHeightIndicatorStart}%`}
							x2={`${xHeightIndicatorStart}%`}
							y1={metrics.baseline}
							y2={metrics.xHeight}
						/>
						<line
							x1={`${xHeightIndicatorStart + 2}%`}
							x2={`${xHeightIndicatorStart - 2}%`}
							y1={metrics.xHeight}
							y2={metrics.xHeight}
						/>

						<line
							x1={`${capHeightIndicatorStart - 2}%`}
							x2={`${capHeightIndicatorStart + 2}%`}
							y1={metrics.baseline}
							y2={metrics.baseline}
						/>
						<line
							x1={`${capHeightIndicatorStart}%`}
							x2={`${capHeightIndicatorStart}%`}
							y1={metrics.baseline}
							y2={metrics.capHeight}
						/>
						<line
							x1={`${capHeightIndicatorStart + 2}%`}
							x2={`${capHeightIndicatorStart - 2}%`}
							y1={metrics.capHeight}
							y2={metrics.capHeight}
						/>
					</g>}
				</g>
				<g
					mask={`url(#${maskId})`}
					stroke="var(--neutral-400)"
					strokeWidth="2"
					strokeDasharray="8"
					css={css`
						line {
							transform-box: view-box;
							&:first-of-type {
								transform: translateX(calc(var(--x) * 100%));
							}
							&:nth-of-type(2) {
								transform: translateY(calc(var(--y) * 100%));
							}
						}
					`}
				>
					<line
						x1="0" y1="0%"
						x2="0" y2="100%"
					/>
					<line
						x1={xBounds[0] * 100 + '%'} y1="0"
						x2={xBounds[1] * 100 + '%'} y2="0"
					/>
				</g>
				<use
					href={`#${circleId}`}
					stroke="var(--neutral-200)" strokeWidth="2.5%"
				/>
			</svg>
		</motion.span>
	</span>;
}
