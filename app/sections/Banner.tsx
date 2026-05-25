'use client'
import React, {useId} from "react";
import {css} from "@emotion/react";
import Precision from "@/app/components/banner-components/Precision";
import Beauty from "@/app/components/banner-components/Beauty";

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

export default function Banner() {
	return <section>
		<div css={css`
            display: flex;
            justify-content: center;
            align-items: start;
            padding-block: 160px 96px;
            text-align: center;
		`}>
			<h1 className="hero-heading">
				<span className="text-4xl" style={{display: 'inline-block'}}>We build software<br/>with</span><br/>
				<span css={css`
					display: inline-block;
					margin-block-start: -0.1em;
                    color: var(--neutral-400);

                    .plus-icon {
                        width: 0.52em;
                        height: auto;
                    }
					.precomma {
						margin-inline-end: 0.05em;
					}
				`}>
					<span style={{display: 'inline-block', marginBlockEnd: '0.2em'}}><Beauty className="precomma"/>, <Precision className="precomma"/>,</span><br/>
					<span><Plus/> </span>
					<span style={{color: "var(--foreground)", marginInlineEnd: '0.5em'}}>identity</span>
				</span>
			</h1>
		</div>
	</section>;
}

function Plus() {
	return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
				className="plus-icon">
		<path d="M5 12h14"/>
		<path d="M12 5v14"/>
	</svg>;
}