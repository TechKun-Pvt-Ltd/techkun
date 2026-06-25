import React, {useEffect, useId, useState} from "react";
import {motion} from "motion/react";
import {animate, SpringOptions} from "motion";
import {css} from "@emotion/react";
import {useFollowPointer} from "@/hooks/use-follow-pointer";
import {useBrowser} from "@/hooks/use-browser";
import {type FontMetrics, measureFont} from "@/app/utils/measure-font";
import {frame} from "motion-dom";
import BANNER_ANIMATION from "@/app/animations/banner";

const xHeightIndicatorStart = 16;
const capHeightIndicatorStart = 67.25;

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
		const container = containerRef.current!;
		const xRay = container.querySelector<HTMLSpanElement>(".x-ray")!;
		const value = x.get();
		let xRayActivated = false;
		const anim = animate([
			[x, [value, 0.1], {duration: 0.3}],
			[x, [0.1, 0.9], {duration: 2}],
			[x, [0.9, value], {duration: 0.3}]
		], {
			delay: BANNER_ANIMATION.precision.delay,
			defaultTransition: {
				ease: "easeInOut",
				onUpdate() {
					if (anim.time > 0 && anim.time < 2.3 && !xRayActivated) {
						xRay.setAttribute("data-active", "true");
						xRayActivated = true;
					} else if (anim.time >= 2.3 && xRayActivated) {
						xRay.removeAttribute("data-active");
						xRayActivated = false;
					}
				}
			}
		});
		xRay.addEventListener("pointerover", () => {
			anim.stop();
			xRay.removeAttribute("data-active");
		}, { once: true });
	}, []);
	useEffect(() => {
		if (!containerRef.current) return;

		let styles: CSSStyleDeclaration;
		let lastFont: string;
		function updateMetrics() {
			if (!styles)
				styles = getComputedStyle(containerRef.current!);

			const font = styles.font;
			if (font === lastFont) return;
			measureFont(lastFont = font).then(setMetrics);
		}
		function listener() {
			frame.setup(updateMetrics);
		}
		listener();
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	}, []);

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
		<motion.span
			className="x-ray"
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
				&:hover, &[data-active] {
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
									color: var(--neutral-700);
									height: 100%;
                                    display: flex;
                                    align-items: center;
									-webkit-text-stroke: 2px var(--neutral-700);
								`}
							>
								precision
							</span>
						</foreignObject> :
						<text
							y="1em"
							fill="var(--neutral-700)"
							stroke="var(--neutral-700)"
							strokeWidth="2"
						>
							precision
						</text>
					}
					{metrics && <g fill="var(--neutral-600)" css={css`
						text {
							--font-index: calc(-2 + 2 * var(--mobile-s-to-laptop));
						}
					`}>
						<text
							className="indexed-font"
							x={`${xHeightIndicatorStart - 1}%`}
							y={metrics.xHeight - 8}
						>x-height</text>
						<text
							className="indexed-font"
							x={`${capHeightIndicatorStart - 1}%`}
							y={metrics.capHeight - 8}
						>cap height</text>
						<text
							className="indexed-font"
							x={`30%`}
							y={metrics.baseline + 20}
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
							strokeDasharray="4%"
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
					strokeDasharray="4%"
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
		precisi<span style={{color: "var(--neutral-700)"}}>o</span>n
	</span>;
}
