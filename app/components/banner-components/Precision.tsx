import React, {useEffect, useId, useRef, useState} from "react";
import {motion} from "motion/react";
import {SpringOptions} from "motion";
import {css} from "@emotion/react";
import {useFollowPointer} from "@/hooks/use-follow-pointer";
import {useBrowser} from "@/hooks/use-browser";

type Metrics = {
	fontSize: number;
	baseline: number;
	ascender: number;
	descender: number;
	xHeight: number;
	capHeight: number;
};

const measureText = async (el: SVGTextElement): Promise<Metrics> => {
	await document.fonts.ready;

	const styles = getComputedStyle(el);

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d")!;

	const fontSize = parseFloat(styles.fontSize);
	ctx.font = styles.font || `
		${styles.fontStyle}
		${styles.fontVariant}
		${styles.fontWeight}
		${styles.fontSize}
		${styles.fontFamily}
	`;

	const text = el.textContent || "";

	const mainMetrics = ctx.measureText(text);
	const xMetrics = ctx.measureText("x");
	const capMetrics = ctx.measureText("H");

	const baseline = mainMetrics.fontBoundingBoxAscent;

	return {
		fontSize,
		baseline,
		ascender: baseline - mainMetrics.fontBoundingBoxAscent,
		descender: baseline + mainMetrics.fontBoundingBoxDescent,
		xHeight: baseline - xMetrics.actualBoundingBoxAscent,
		capHeight: baseline - capMetrics.actualBoundingBoxAscent
	};
};

const xHeightIndicatorStart = 16;
const capHeightIndicatorStart = 68;

const springOptions: SpringOptions = {stiffness: 500, damping: 30};
const DEFAULT_CENTER: [string, string] = ["78.6%", "59%"];
const xBounds: [number, number] = [0, 1];

export default function Precision(props: React.ComponentPropsWithoutRef<typeof motion.span>) {
	const id = useId();
	const browser = useBrowser();

	const textRef = useRef<SVGTextElement & HTMLSpanElement>(null);
	const [metrics, setMetrics] = useState<Metrics | null>(null);

	const clipId = "clip-" + id;
	const maskId = "mask-" + id;
	const circleId = "circle-" + id;
	const {x, y, containerRef} = useFollowPointer({ defaultPosition: DEFAULT_CENTER, springOptions, xBounds });

	useEffect(() => {
		if (browser.isNone || !textRef.current) return;

		measureText(textRef.current).then(setMetrics);
	}, [browser]);

	return <motion.span
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
		whileHover="hover"
	>
		precisi<span style={{opacity: 0.2}}>o</span>n
		<span css={css`
            position: absolute;
            inset: 0;
		`}>
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
					<motion.circle
						id={circleId}
						r="0.24em" cx={x} cy={y}
						variants={{
							hover: {
								r: "0.72em"
							}
						}}
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
								ref={textRef}
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
							ref={textRef}
							y={metrics ? metrics.fontSize : undefined}
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
							y={metrics.descender - 1}
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
							x1={`${xHeightIndicatorStart - 6}%`}
							x2={`${xHeightIndicatorStart + 4}%`}
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
							x1={`${xHeightIndicatorStart + 4}%`}
							x2={`${xHeightIndicatorStart - 6}%`}
							y1={metrics.xHeight}
							y2={metrics.xHeight}
						/>

						<line
							x1={`${capHeightIndicatorStart - 6}%`}
							x2={`${capHeightIndicatorStart + 4}%`}
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
							x1={`${capHeightIndicatorStart + 4}%`}
							x2={`${capHeightIndicatorStart - 6}%`}
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
				>
					<motion.line
						x1={x} y1="0%"
						x2={x} y2="100%"
					/>
					<motion.line
						x1={xBounds[0] * 100 + '%'} y1={y}
						x2={xBounds[1] * 100 + '%'} y2={y}
					/>
				</g>
				<use
					href={`#${circleId}`}
					stroke="var(--neutral-200)" strokeWidth="2.5%"
				/>
			</svg>
		</span>
	</motion.span>;
}
