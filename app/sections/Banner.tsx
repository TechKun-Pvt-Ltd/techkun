'use client'
import React, {useEffect, useRef} from "react";
import {SvgTextAnimationControls} from "@/app/components/AnimatedSvgText";
import {delay} from "motion/react";
import {css} from "@emotion/react";
// import AnimatedStrikeThrough from "@/app/components/AnimatedStrikeThrough";
// import AnimatedLogo from "@/app/components/AnimatedLogo";
// import {Ephesis} from "next/font/google";
//
// const font = Ephesis({weight: '400'});

export default function Banner() {
    // const strikeThroughRef = useRef<CrossedTextAnimationControls>(null);
    // const svgTextRef = useRef<SvgTextAnimationControls>(null);

    // useEffect(() => {
    //     return delay(() => {
    //         strikeThroughRef.current?.start();
    //         svgTextRef.current?.start();
    //     }, 1000);
    // }, []);

    return <section>
        <div css={css`
            display: grid;
            grid-template-columns: subgrid;
            align-items: center;
        `}>
            <div css={{gridColumn: 'span 4'}}>
                <h1 css={css`
                    //height: 12rem;
                    //font-size: 3rem;
                    //position: relative;
                `}>
                    <span style={{display: 'inline-block', marginBlockEnd: '0.375em'}}>Tired of funding repairs?</span><br/>
                    You're in the right place.
                    {/*<span css={css`*/}
                    {/*    position: absolute;*/}
                    {/*    top: 0;*/}
                    {/*    left: 0;*/}
                    {/*    width: 100%;*/}
                    {/*    height: 100%;*/}
                    {/*    will-change: transform*/}
                    {/*`}>*/}
                    {/*    Do you want to<br/>*/}
                    {/*    <span css={{whiteSpace: 'nowrap'}}>*/}
                    {/*        fund <AnimatedStrikeThrough ref={strikeThroughRef} thickness={7.5} color={"var(--primary-500)"}>*/}
                    {/*            repairs*/}
                    {/*            <AnimatedSvgText ref={svgTextRef}*/}
                    {/*                style={css`*/}
                    {/*                    position: absolute;*/}
                    {/*                    right: 0;*/}
                    {/*                    bottom: -5rem;*/}
                    {/*                `} color="var(--primary-500)"*/}
                    {/*                fontStyles={{fontSize: '5rem', ...font.style}}*/}
                    {/*            >growth</AnimatedSvgText>*/}
                    {/*        </AnimatedStrikeThrough>*/}
                    {/*        <span>?</span>*/}
                    {/*    </span>*/}
                    {/*</span>*/}
                </h1>
            </div>
            <div css={{
                paddingBlock: '36px',
                gridColumn: 'span 2'
            }}></div>
        </div>
    </section>;
}