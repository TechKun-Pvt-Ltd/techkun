'use client'
import React, {useEffect, useRef} from "react";
import {css} from "@emotion/react";
import {animate, motion, useMotionValue, AnimationPlaybackControlsWithThen, ValueAnimationTransition} from "motion/react";

const IDLE_ANIMATION_REPEAT_DELAY = 8;
function SPRING_OPTIONS(duration: number): ValueAnimationTransition {
    return {
        type: "spring",
        bounce: 0,
        duration
    };
}
const idleAnimationOptions: ValueAnimationTransition = {
    ...SPRING_OPTIONS(2),
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: IDLE_ANIMATION_REPEAT_DELAY
};

export default function Banner() {
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
                <span css={css`
                    font-size: var(--font-size-8xl);
                    letter-spacing: var(--letter-spacing-8xl);
                    line-height: var(--line-height-8xl);
                `}>
                    robust,<br/>
                    <span css={css`
                        position: relative;
                        isolation: isolate;
                        //color: var(--primary-400);
                        font-style: italic;
                        font-weight: 600;
                    `}>
                        {Array.from({ length: 4 }).map((_, i) =>
                            <span style={{
                                opacity: 0.5 - i * 0.125,
                                position: "absolute",
                                left: -(i + 1) * 10,
                                zIndex: -(i + 1)
                            }}>f</span>
                        )}
                        fast
                    </span>,<br/>
                    & delightful.
                </span>
            </h1>
        </div>
    </section>;
}