'use client'
import React, {useId} from "react";
import {css, keyframes} from "@emotion/react";
const shine = keyframes`
    0% {
        --gradient-pos-x: -10%;
		--gradient-pos-y: 200%;
    }
    100% {
        --gradient-pos-x: 20%;
		--gradient-pos-y: -100%;
    }
`;
export default function Banner() {
	const id = useId();
	return <section>
		<div css={css`
            display: flex;
            justify-content: center;
            align-items: start;
            padding: 96px;
            text-align: center;
		`}>
			<h1 className="hero-heading">
				We build software<br/>that are<br/>
				<span className="text-8xl" css={css`
                    //color: var(--background);
                    //-webkit-text-stroke: 1px var(--foreground);
				`}>robust</span><br/>
				<span className="text-8xl" css={css`
                    //color: var(--primary-400);
                    font-style: italic;
                    font-weight: 600;
				`}>
                    <svg css={css`
                        width: 3.56ch;
					`}>
                        {Array.from({length: 4}).map((_, i) =>
							<text
								key={i}
								opacity={(i + 1) * 0.125}
								x={-10 + i * 10} y="var(--font-size-8xl)"
								fill="var(--neutral-200)"
							>f</text>
						)}
						<defs>
                            <mask id={`text-mask-${id}`}>
                                <rect fill="white" x="0" y="%" width="100%" height="100%"/>
                                <text x={-10 + 40} y="var(--font-size-8xl)">fast</text>
                            </mask>
                        </defs>
                        <text x={-10 + 40} mask={`url(#text-mask-${id})`} strokeWidth="3" stroke="var(--foreground)"
							  y="var(--font-size-8xl)">fast</text>
                        <text x={-10 + 40} fill="var(--background)" y="var(--font-size-8xl)">fast</text>
                    </svg>
                </span><br/>
				& &nbsp;<span className="text-8xl cursive-text" css={css`
                //color: var(--background);
                //-webkit-text-stroke: 1px var(--foreground);
			`}>
                    <svg css={css`
                        width: 4.2em;
                        height: 1em;
                        overflow: visible;
					`}>
                        <defs>
							<mask id={`stroke-mask-${id}`}>
								<text y="var(--font-size-8xl)" stroke="white" strokeWidth="2">delightful</text>
							</mask>
                        </defs>
						<foreignObject mask={`url(#stroke-mask-${id})`} x="-5%" y="-5%" width="110%" height="160%">
							<div xmlns="http://www.w3.org/1999/xhtml" css={css`
								@property --gradient-pos-x {
								  	syntax: "<length-percentage>";
									inherits: true;
									initial-value: 0%;
								}
								@property --gradient-pos-y {
								  	syntax: "<length-percentage>";
									inherits: true;
									initial-value: 0%;
								}
                                width: 100%;
                                height: 100%;
                                background: radial-gradient(
                                    40px at var(--gradient-pos-x) var(--gradient-pos-y),
                                    var(--primary-50),
                                    var(--primary-800),
                                    transparent
                                ) 50%/100%;
                                animation: ${shine} 8s linear infinite;
							`} />
						</foreignObject>
                        <text y="var(--font-size-8xl)" fill="var(--neutral-700)">delightful</text>
                    </svg>
                </span>
			</h1>
		</div>
	</section>;
}