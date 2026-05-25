'use client'
import React, {useId} from "react";
import {css} from "@emotion/react";
import Precision from "@/app/components/banner-components/Precision";
import Beauty from "@/app/components/banner-components/Beauty";
import Identity from "@/app/components/banner-components/Identity";

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
				<span className="text-4xl" style={{display: 'inline-block'}}>
					We build software<br/>
					with
				</span><br/>
				<span css={css`
					display: inline-block;
                    color: var(--neutral-400);

                    .plus-icon {
                        width: 0.52em;
                        height: auto;
                    }
					.precomma {
						margin-inline-end: 0.05em;
					}
				`}>
					<span style={{display: 'inline-block', marginBlockEnd: '0.25em'}}><Beauty className="precomma"/>, <Precision className="precomma"/>,</span><br/>
					<span><Plus/> </span>
					<Identity style={{ marginInlineEnd: "0.5em" }} />
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