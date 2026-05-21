'use client'
import React, {useId} from "react";
import {css} from "@emotion/react";

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
                We build software that's<br/>
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
                        {Array.from({ length: 4 }).map((_, i) =>
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
                        <text x={-10 + 40} mask={`url(#text-mask-${id})`} strokeWidth="3" stroke="var(--foreground)" y="var(--font-size-8xl)">fast</text>
                        <text x={-10 + 40} fill="var(--background)" y="var(--font-size-8xl)">fast</text>
                    </svg>
                </span><br/>
                & <span className="text-8xl" css={css`
                    //color: var(--background);
                    //-webkit-text-stroke: 1px var(--foreground);
                `}>delightful</span>
            </h1>
        </div>
    </section>;
}