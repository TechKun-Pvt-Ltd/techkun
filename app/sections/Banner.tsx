'use client'
import React, {useEffect, useRef} from "react";
import {css} from "@emotion/react";
import {animate, motion, useMotionValue} from "motion/react";
import {AnimationPlaybackControlsWithThen, ValueAnimationTransition} from "motion";

const IDLE_ANIMATION_REPEAT_DELAY = 8;
function SPRING_OPTIONS(duration: number): ValueAnimationTransition {
    return {
        type: "spring",
        bounce: 0,
        duration
    };
}

export default function Banner() {
    const activeAnimation = useRef<AnimationPlaybackControlsWithThen>(null);
    const strokeDashoffset = useMotionValue(11);
    function setActiveAnimation(anim: AnimationPlaybackControlsWithThen) {
        activeAnimation.current?.stop();
        activeAnimation.current = anim;
    }

    function startIdleAnimation() {
        setActiveAnimation(animate(strokeDashoffset, [11, -11], {
            ...SPRING_OPTIONS(2),
            delay: IDLE_ANIMATION_REPEAT_DELAY,
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: IDLE_ANIMATION_REPEAT_DELAY
        }));
    }

    useEffect(() => {
        const animation = animate(strokeDashoffset, [11, -11], SPRING_OPTIONS(2));
        setActiveAnimation(animation);
        animation.finished.then(startIdleAnimation);
    }, []);

    function fillPath() {
        const value = strokeDashoffset.get();
        if (value >= 0) {
            setActiveAnimation(animate(strokeDashoffset, 0, SPRING_OPTIONS(value / 11)));
            return;
        }

        const animation = animate(strokeDashoffset, -11, SPRING_OPTIONS((value + 11) / 11));
        setActiveAnimation(animation);
        animation.finished.then(() => {
            setActiveAnimation(animate(strokeDashoffset, [11, 0], SPRING_OPTIONS(1)));
        });
    }
    function emptyPath() {
        // strokeDashoffset.stop();
        const value = strokeDashoffset.get();
        const animation = animate(strokeDashoffset, -11, SPRING_OPTIONS((value + 11) / 11));
        setActiveAnimation(animation);
        animation.finished.then(startIdleAnimation);
    }

    return <section>
        <div css={css`
            display: grid;
            grid-template-columns: subgrid;
            align-items: center;
            & > div:first-of-type {
                grid-column: 1 / -1;
                text-align: center;
            }
            & > div:nth-of-type(2) {
                grid-column: 1 / -1;
            }
        `}>
            <div>
                <h1 className="hero-heading">
                    <span style={{display: 'inline-block', marginBlockEnd: '0.375em'}}>Tired of funding <pre>
                        repa
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="-1 -12 3.25 13" css={css`
                            margin-block-end: -0.125em;
                            margin-inline: 0.0625em;
                            transform: rotateZ(4deg);
                            transition: transform 0.3s ease-in-out;
                            pre:hover & {
                                transform: rotateZ(-4deg);
                            }
                        `}>
                            <path d="M 0 0 L 0.1841 -7.4977 C 0.1967 -8.013 0.0498 -8.5195 -0.2365 -8.948 C -0.7003 -9.6422 -0.6092 -10.5674 -0.0189 -11.1577 C 0.0315 -11.2081 0.1177 -11.1724 0.1177 -11.1011 L 0.1177 -9.8511 C 0.1177 -9.741 0.1897 -9.6439 0.2951 -9.6119 C 0.579 -9.5258 0.8821 -9.5258 1.166 -9.6119 C 1.2713 -9.6439 1.3434 -9.741 1.3434 -9.8511 L 1.3434 -11.1011 C 1.3434 -11.1724 1.4296 -11.2081 1.48 -11.1577 C 2.0703 -10.5674 2.1614 -9.6422 1.6976 -8.948 C 1.4113 -8.5195 1.2644 -8.013 1.277 -7.4977 L 1.4611 0 A 0.7305 0.7305 -90 1 1 0.0004 0 Z M 1.2328 0 A 0.5023 0.5023 -90 0 0 0.2283 0 A 0.5023 0.5023 -90 0 0 1.2328 0 Z"
                                fill="currentColor"
                            />
                        </svg>
                        rs?
                    </pre></span><br/>
                    Start funding <pre>gro
                    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10"
                        css={css`
                            width: 1em;
                            margin-block-end: -0.0625em;
                        `}
                        onHoverStart={fillPath}
                        onHoverEnd={emptyPath}
                    >
                        <defs>
                            <path id="w-graph" d="M 1 5 L 2 3 L 4.25 9 L 6 4.5 L 7.75 9 L 11 1 L 9.4216 2.2283 L 11 1 L 11.2746 2.9811"
                                pathLength="10" strokeWidth="0.5" strokeLinejoin="round" strokeLinecap="round" fill="transparent"
                            />
                        </defs>
                        <use href="#w-graph" stroke="currentColor" />
                        <motion.use href="#w-graph" stroke="var(--primary-400)"
                            strokeDasharray="11 11"
                            style={{ strokeDashoffset }}
                        />
                    </motion.svg>
                    th.</pre>
                </h1>
            </div>
            <div style={{alignSelf: 'stretch'}}>

            </div>
        </div>
    </section>;
}