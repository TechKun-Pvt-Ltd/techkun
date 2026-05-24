'use client'
import React, {useId, useRef} from "react";
import {css, keyframes} from "@emotion/react";
import {motion, useSpring, useTransform} from "motion/react";
import {useFollowPointer} from "@/app/utils/use-follow-pointer";
import {usePointerPosition} from "@/app/utils/use-pointer-position";
import {clamp, SpringOptions} from "motion";
import {useMappedValues} from "@/app/utils/use-mapped-values";

function FastSvg() {
	const id = useId();
	const startX = -10;
	const xStep = 5;
	const repeatingCharLength = 4;
	const opacityStep = 0.75 / repeatingCharLength;

	const repeatingCharArray: string[] = new Array(repeatingCharLength).fill("f");
	const mainText = "fast";
	const mainTextX = startX + repeatingCharLength * xStep;

	const fontSize = "var(--font-size-6xl)";
	// const maskId = "text-mask-" + id;

	return <svg css={css`
        width: 2em;
        height: 1em;
        overflow: visible;
        font-style: italic;
        //font-weight: 500;
	`}>
		{repeatingCharArray.map((char, i) =>
			<text
				key={i}
				opacity={(i + 1) * opacityStep}
				x={startX + i * xStep} y={fontSize}
				fill="var(--neutral-200)"
			>{char}</text>
		)}
		{/*<defs>*/}
		{/*	<mask id={maskId}>*/}
		{/*		<rect fill="white" x="0%" y="0%" width="100%" height="100%"/>*/}
		{/*		<text x={mainTextX} y={fontSize}>{mainText}</text>*/}
		{/*	</mask>*/}
		{/*</defs>*/}
		{/*<text x={mainTextX} y={fontSize}*/}
		{/*	  mask={`url(#${maskId})`}*/}
		{/*	  strokeWidth="3" stroke="var(--foreground)"*/}
		{/*>{mainText}</text>*/}
		<text x={mainTextX} y={fontSize} fill="var(--foreground)">{mainText}</text>
	</svg>;
}

const initialDomRect = {
	x: 0, y: 0, width: 0, height: 0
};
type BoundingRect = {
	x: number
	y: number
	width: number
	height: number
};

const springOptions: SpringOptions = { stiffness: 500, damping: 30 };
const DEFAULT_CENTER: [string, string] = ["23%", "59%"];

function Robust({style, ...props}: React.ComponentPropsWithoutRef<typeof motion.span>) {
	const rootBoundingRect = useRef<BoundingRect>(initialDomRect);
	const id = useId();
	const textMaskId = "text-mask-" + id;
	const clipId = "clip-" + id;
	const pointer = usePointerPosition();

	const centerArr = useTransform<number, [string, string]>([pointer.x, pointer.y], ([vx, vy]) => {
		if (!(rootBoundingRect.current && rootBoundingRect.current.width && rootBoundingRect.current.height))
			return DEFAULT_CENTER;

		const xProgress = (vx - rootBoundingRect.current.x) / rootBoundingRect.current.width;
		const yProgress = (vy - rootBoundingRect.current.y) / rootBoundingRect.current.height;
		if (xProgress < 0 || xProgress > 1 || yProgress < 0 || yProgress > 1)
			return DEFAULT_CENTER;
		return [`${clamp(0, 1, xProgress) * 100}%`, `${clamp(0, 1, yProgress) * 100}%`];
	});
	const center = useMappedValues(centerArr, c => c);
	const centerX = useSpring(center[0], springOptions);
	const centerY = useSpring(center[1], springOptions);

	return <motion.span
		style={{position: 'relative', zIndex: '0', ...style}}
		{...props}
		ref={el => {
			if (!el) return;

			function update() {
				if (!el) return;
				rootBoundingRect.current = el.getBoundingClientRect();
			}
			update();
			window.addEventListener("scroll", update);
			window.addEventListener("resize", update);
			return () => {
				window.removeEventListener("scroll", update);
				window.removeEventListener("resize", update);
			};
		}}
		whileHover="hover"
	>
		r
		<span style={{ opacity: 0.2 }}>o</span>
		bust
		<svg css={css`
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			overflow: visible;
		`}>
			<clipPath id={clipId}>
				<motion.circle
					r="10%" cx={centerX} cy={centerY}
					variants={{
						hover: { r: "20%" }
					}}
				/>
			</clipPath>
			<mask id={textMaskId}>
				<rect width="100%" height="120%" fill="white"></rect>
				<text fill="black" y="var(--font-size-6xl)">
					robust
				</text>
			</mask>
			<g clipPath={`url(#${clipId})`}>
				<text mask={`url(#${textMaskId})`} strokeWidth="2" stroke="var(--neutral-500)" y="var(--font-size-6xl)">
					robust
				</text>
				<text y="var(--font-size-6xl)" fill="var(--muted)">
					robust
				</text>
			</g>
		</svg>
		<svg
			fill="none"
			css={css`
				position: absolute;
				inset: 0;
				width: 100%;
				height: 100%;
				overflow: visible;
			`}
		>
			<motion.line
				x1={centerX} y1="0%"
				x2={centerX} y2="100%"
				stroke="var(--neutral-400)"
				strokeWidth="2"
				strokeDasharray="6"
			/>
			<motion.line
				x1="0%" y1={centerY}
				x2="100%" y2={centerY}
				stroke="var(--neutral-400)"
				strokeWidth="2"
				strokeDasharray="6"
			/>
			<motion.circle
				r="10%" cx={centerX} cy={centerY}
				variants={{
					hover: { r: "20%" }
				}}
				stroke="var(--foreground)" strokeWidth="2.5%"
			/>
		</svg>
	</motion.span>;
}


// const gradientAngle = property("gradient-angle")`
//     syntax: "<angle>";
//     inherits: true;
//     initial-value: 0deg;
// `;
//
// const rotateConicGradient = keyframes`
//     0% {
//         ${gradientAngle}: 0deg;
//     }
//     100% {
//         ${gradientAngle}: 360deg;
//     }
// `;
function Delightful() {
	const id = useId();
	return <svg css={css`
        width: 4.2em;
        height: 1em;
        overflow: visible;
	`}>
		<defs>
			<mask id={`stroke-mask-${id}`}>
				<text y="var(--font-size-4xl)" stroke="white" strokeWidth="2">delightful</text>
			</mask>
		</defs>
		<foreignObject mask={`url(#stroke-mask-${id})`} x="-5%" y="-5%" width="110%" height="160%">
			<div xmlns="http://www.w3.org/1999/xhtml" css={css`
                width: 100%;
                height: 100%;
                //background: conic-gradient(
                //    from var({gradientAngle}) at 50% 50%,
                //    var(--secondary-500),
                //    var(--primary-500),
                //    var(--primary-500),
                //    var(--secondary-500)
                //) 50%/100%;
                //animation: {rotateConicGradient} 4s linear infinite;
			`}/>
		</foreignObject>
		<text y="var(--font-size-4xl)" fill="var(--background)">delightful</text>
	</svg>;
}

const gradientMove = keyframes`
    0% {
        --gradient-end: 0%;
    }
    66%, 100% {
        --gradient-end: 115%;
    }
`;
export default function Banner() {
	const ref = useRef<HTMLDivElement>(null);
	const {x, y} = useFollowPointer(ref);

	return <section>
		<div css={css`
            display: flex;
            justify-content: center;
            align-items: start;
			padding-block: 160px 96px;
            text-align: center;
		`}>
			<h1 className="hero-heading">
				We build software<br/>
				that are<br/>
				<span css={css`
                    .plus-icon {
                        color: var(--neutral-400);
                        width: 0.8em;
                        height: auto;
                    }
				`}>
					<Robust className="text-6xl" />
					<span css={css`
						margin-inline-start: 0.4em;
						margin-inline-end: 0.2em;
					`}><Plus/></span>
					<i className="text-6xl"
					   style={{ position: 'relative', bottom: '-3px' }}
					>fast</i><br/>
					<span css={css`
						margin-inline-end: 0.4em;
					`}><Plus/></span>
					<motion.span
						ref={ref}
						className="text-6xl"
						style={{
							'--pointer-x': x,
							'--pointer-y': y
						} as React.CSSProperties}
						css={css`
                            @property --gradient-end {
                                syntax: "<length-percentage>";
                                inherits: false;
                                initial-value: 0%;
                            }
                            @property --pointer-x {
                                syntax: "<number>";
                                inherits: false;
                                initial-value: 0.5;
                            }
                            @property --pointer-y {
                                syntax: "<number>";
                                inherits: false;
                                initial-value: 0.5;
                            }
                            color: transparent;
                            //font-weight: 600;
                            background-image: //linear-gradient(
                                //	5deg,
                                //	transparent calc(var(--gradient-end) - 15%),
                                //	var(--secondary-400) calc(var(--gradient-end) - 10%),
                                //	var(--secondary-400) calc(var(--gradient-end) - 5%),
                                //	transparent var(--gradient-end)
                                //),
                                radial-gradient(
                                    circle at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 100%),
                                    var(--secondary-300) 25%,
                                    var(--secondary-500) 25%,
                                    var(--primary-500)
                                );
                            background-clip: text;
                            animation: ${gradientMove} 4s linear infinite;
						`}
					>delightful</motion.span>
				</span>
			</h1>
		</div>
	</section>;
}

function Plus() {
	return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
				className="plus-icon">
		<path d="M5 12h14"/>
		<path d="M12 5v14"/>
	</svg>;
}