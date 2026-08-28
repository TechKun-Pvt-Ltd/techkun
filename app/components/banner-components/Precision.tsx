import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {motion, visualElementStore, animate, BezierDefinition, SpringOptions} from "motion/react";
import {css} from "@emotion/react";
import {useFollowPointer} from "@/hooks/use-follow-pointer";
import {type FontMetrics, measureFont} from "@/app/utils/measure-font";
import {frame} from "motion-dom";
import BANNER_ANIMATION from "@/app/animations/banner";
import useAbortSignal from "@/hooks/use-abort-signal";
import {BrowserName, detectBrowser} from "@/hooks/use-browser";

const xHeightIndicatorStart = 16;
const capHeightIndicatorStart = 67.25;

const springOptions: SpringOptions = {stiffness: 500, damping: 30};
const DEFAULT_CENTER: [number, number] = [0.786, 0.59];

const radius_normal = "0.24em";
const radius_enlarged = "0.72em";

export type PrecisionRef = {
	play(): void;
};

export default forwardRef<PrecisionRef, React.ComponentPropsWithoutRef<"span">>(function Precision(
	props, ref
) {
	const [metrics, setMetrics] = useState<FontMetrics | null>(null);
	const {x, y, containerRef} = useFollowPointer({ defaultPosition: DEFAULT_CENTER, springOptions });
	const abortSignal = useAbortSignal();

	useImperativeHandle(ref, () => ({
		play() {
			const container = containerRef.current!;
			const xRay = container.querySelector<HTMLSpanElement>(".x-ray")!;
			const value = x.get();

			const easing: BezierDefinition = [0.9, -0.6, 0.75, 0.2];
			const phase1Dur = 1;
			const phase2Dur = 2;
			const phase3Dur = 0.3;
			const totalDuration = phase1Dur + phase2Dur + phase3Dur;
			const offsets = [0, phase1Dur / totalDuration, (phase1Dur + phase2Dur) / totalDuration, 1];
			const radiusKeyframes = [radius_normal, radius_enlarged, radius_enlarged, radius_normal];

			xRay.toggleAttribute("data-animate");
			const isStupidFirefox = detectBrowser(BrowserName.STUPID_FIREFOX);
			let stopRadiusAnimation: VoidFunction;
			if (isStupidFirefox) {
				const xRayAnim = animate(xRay, { "--r": radiusKeyframes }, {
					duration: totalDuration,
					delay: BANNER_ANIMATION.precision.delay,
					ease: [easing, "linear", "easeInOut"],
					times: offsets,
					onStop() {
						visualElementStore.get(xRay)?.removeValue("--r");
						xRay.style.removeProperty("--r");
					}
				});
				stopRadiusAnimation = () => xRayAnim.stop();
			} else {
				const xRayAnim = xRay.animate({
					"--r": radiusKeyframes,
					offset: offsets,
					easing: [`cubic-bezier(${easing.join(", ")})`, "linear", "ease-in-out"]
				}, {
					duration: totalDuration * 1000,
					delay: BANNER_ANIMATION.precision.delay * 1000,
					fill: "both"
				});
				stopRadiusAnimation = () => xRayAnim.cancel();
			}
			const anim = animate([
				[x, [value, 0.1], {duration: phase1Dur, ease: easing}],
				[x, [0.1, 0.9], {duration: phase2Dur}],
				[x, [0.9, value], {duration: phase3Dur}]
			], {
				delay: BANNER_ANIMATION.precision.delay,
				defaultTransition: { ease: "easeInOut" }
			});

			xRay.addEventListener("pointerover", () => {
				anim.stop();
				xRay.removeAttribute("data-animate");
				stopRadiusAnimation();
			}, { once: true, signal: abortSignal });
		}
	}), []);

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
		window.addEventListener("resize", listener, { signal: abortSignal });
	}, []);

	return <span
		{...props}
		css={css`
			position: relative;
			color: var(--foreground);
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
				isolation: isolate;
				position: absolute;
				inset: 0;
				display: flex;
				align-items: center;
				--r: ${radius_normal};
				&:hover {
					--r: ${radius_enlarged};
				}
				--transition: --r 0.2s ease-in-out;
				&[data-animate] {
					--transition: none;
				}

				.clipped, .masked {
					transition: var(--transition);
				}
				.clipped {
					clip-path: circle(var(--r) at calc(var(--x) * 100%) calc(var(--y) * 100%));
				}
				.masked {
					mask: radial-gradient(
						circle var(--r) at calc(var(--x) * 100%) calc(var(--y) * 100%),
						oklch(0 0 0 / 0.4) 100%,
						black 100%,
						black 200%
					);
				}
				svg {
					position: absolute;
					inset: 0;
					width: 100%;
					height: 100%;
					overflow: visible;
					fill: none;
					stroke-linecap: round;
					stroke-linejoin: round;
				}
			`}
		>
			<div
				className="clipped"
				css={css`
					position: absolute;
					inset: 0;
					z-index: -1;
					&::before {
						content: "";
						position: absolute;
						inset: -75% -50%;
						background-color: oklch(0 0 0 / 0.75);
					}
				`}
			/>
			<span
				className="clipped"
				css={css`
					color: var(--neutral-700);
					-webkit-text-stroke: 2px var(--neutral-700);
				`}
			>precision</span>

			{metrics && <svg
				xmlns="http://www.w3.org/2000/svg"
				className="clipped"
			>
				<g fill="var(--neutral-600)" css={css`
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
				</g>
				<g
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
				</g>
			</svg>}

			<svg
				xmlns="http://www.w3.org/2000/svg"
				stroke="var(--neutral-400)"
				strokeWidth="2"
				strokeDasharray="4%"
				className="masked"
			>
				<line
					x1="0" y1="0%"
					x2="0" y2="100%"
					css={css`
						transform-box: view-box;
						transform: translateX(calc(var(--x) * 100%));
					`}
				/>
				<line
					x1="0%" y1="0"
					x2="100%" y2="0"
					css={css`
						transform-box: view-box;
						transform: translateY(calc(var(--y) * 100%));
					`}
				/>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg">
				<circle
					cx="0" cy="0"
					stroke="var(--neutral-200)" strokeWidth="2.5%"
					css={css`
						r: var(--r);
						transition: var(--transition);
						transform-box: view-box;
						transform: translate(calc(var(--x) * 100%), calc(var(--y) * 100%));
					`}
				/>
			</svg>
		</motion.span>
		precisi<span style={{color: "var(--neutral-700)"}}>o</span>n
	</span>;
});
