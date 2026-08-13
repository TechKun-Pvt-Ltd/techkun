'use client';
import {css} from "@emotion/react";
import React, {useEffect} from "react";
import logoAnimation from "@/public/logo-animation.json";
import {viewBoxString} from "@/app/utils/graphics-utils";
import {inView, motion, useAnimate, useMotionValue} from "motion/react";
import {BR_BRAND_GRADIENT_HREF} from "@/app/Shared";
import useBrowser from "@/hooks/use-browser";

const ANIMATED_LOGO_CLIP_PATH_ID = "animated-logo-clip-path";

const STARS_COUNT = 50;

export default function MeetTechKun() {
    const isStupidFirefox = useBrowser("stupid-firefox");
    const [starsMounted, setStarsMounted] = React.useState(true);
    const randomnessIndex = Array.from({ length: STARS_COUNT }, Math.random);

    const [scope, animate] = useAnimate<HTMLDivElement>();
    const x = useMotionValue('0%');
    const y = useMotionValue('0%');

    useEffect(() => {
        const heading = scope.current.querySelector('h2');
        const svg = scope.current.querySelector('svg.animated-logo-svg');
        const path = scope.current.querySelector("path.animated-logo-path");
        const starsContainer = scope.current.querySelector(".stars-container");

        inView(heading, () => {
            starsContainer?.toggleAttribute("data-animate");
            animate([
                [svg, { opacity: 1 }, {
                    duration: 2.25,
                    ease: [0.995, -0.035, 0.945, 0.923],
                    delay: 1.5
                }],
                [svg, { scale: 1 }, {
                    type: "spring",
                    visualDuration: 0.5,
                    bounce: 0.4,
                    at: "-0.5"
                }],
                [path, { x: "0%", y: "0%" }, { type: "spring", duration: 1.5, bounce: 0.1, at: '-0.5' }],
                [
                    path, { d: logoAnimation.frames.map(f => f.value) },
                    { duration: logoAnimation.duration, ease: 'linear', at: '-0.75'}
                ]
            ], {
                onComplete() {
                    setStarsMounted(false);
                }
            });
        });
    }, []);

    useEffect(() => {
        const path = scope.current.querySelector<SVGPathElement>(isStupidFirefox ? "path.animated-logo-path-measurer" : "path.animated-logo-path")!;

        const pathBBox = path.getBBox();
        if (!pathBBox.width || !pathBBox.height) return;

        const {viewBox} = logoAnimation;
        const currentX = (pathBBox.x - viewBox.x) + pathBBox.width / 2;
        const currentY = (pathBBox.y - viewBox.y) + pathBBox.height / 2;
        const targetX = viewBox.width / 2;
        const targetY = viewBox.height / 2;
        x.set(`${((targetX - currentX) / pathBBox.width * 100)}%`);
        y.set(`${((targetY - currentY) / pathBBox.height * 100)}%`);
    }, [isStupidFirefox]);

    return <section css={css`
        align-items: center;
        position: relative;
        isolation: isolate;

        &::before {
            content: '';
            z-index: -1;
            position: absolute;
            inset: 0;
            background: radial-gradient(
                ellipse var(--page-max-width) 75% at 50% 50%,
                transparent 12.5%,
                var(--secondary-950) 62.5%,
                transparent
            );
            mask: linear-gradient(
                to bottom,
                transparent 25%,
                oklch(0 0 0 / 0.75) 73.75%,
                oklch(0 0 0 / 0.75) 76.25%,
                transparent 97.5%
            );
        }
    `}>
        <div ref={scope} css={css`
            height: max-content;
            display: grid;
            grid-template-columns: subgrid;
            row-gap: clamp(64px, 10vh, 96px);
            padding-block: 640px;
        `}>
            <div css={css`
                grid-column: 1 / -1;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            `}>
                {starsMounted && <div className="stars-container" css={css`
                    position: absolute;
                    filter: drop-shadow(0 0 3px var(--secondary-neutral-50));

                    .star {
                        position: absolute;
                        width: 3px;
                        height: 3px;
                        background: var(--secondary-neutral-50);
                        border-radius: 50%;
                        transform-origin: center;

                        @property --scale {
                            syntax: "<number>";
                            inherits: false;
                            initial-value: 1;
                        }
                        @keyframes star-suck-in {
                            to {
                                --polar-angle: calc(var(--polar-angle-init) + 45deg);
                                --polar-radius: 0px;
                                --scale: 0.5;
                            }
                        }
                        @keyframes star-blink {
                            0% { opacity: 0; }
                            60% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { opacity: 0; }
                        }
                        opacity: 0;
                        --polar-angle: var(--polar-angle-init);
                        transform: translate(
                            calc(cos(var(--polar-angle)) * var(--polar-radius)),
                            calc(sin(var(--polar-angle)) * var(--polar-radius) * 0.5)
                        ) scale(var(--scale));
                        animation: 2s var(--delay) forwards paused;
                        animation-name: star-suck-in, star-blink;
                        animation-timing-function: cubic-bezier(0.995, -0.035, 0.945, 0.923), ease-in-out;
                    }
                    &[data-animate] .star {
                        animation-play-state: running;
                    }
                `}>
                    {Array.from({length: STARS_COUNT}, (_, i) =>
                        <div
                            key={i} className="star"
                            style={{
                                '--polar-radius': (200 + 400 * randomnessIndex[i]) + 'px',
                                '--polar-angle-init': (i / STARS_COUNT * 360 + 15 - 30 * randomnessIndex[i]) + 'deg',
                                '--delay': (i % 5) / 4 + 0.5 * randomnessIndex[i] * Math.sign(i) + "s"
                            } as React.CSSProperties}
                            suppressHydrationWarning
                        ></div>
                    )}
                </div>}
                <div css={css`
                    width: clamp(240px, 75%, 400px);
                `}>
                    <motion.svg
                        className="animated-logo-svg"
                        style={{ display: "block", transformOrigin: '50%' }}
                        initial={{ opacity: 0, scale: 0.625 }}
                        viewBox={viewBoxString(logoAnimation.viewBox)}
                    >
                        {isStupidFirefox && <motion.path
                            d={logoAnimation.frames[0].value}
                            className="animated-logo-path-measurer"
                            fill="none"
                            opacity="0"
                        />}
                        <defs>
                            <clipPath id={ANIMATED_LOGO_CLIP_PATH_ID}>
                                <motion.path
                                    d={logoAnimation.frames[0].value}
                                    className="animated-logo-path"
                                    style={{transformBox: 'fill-box', transformOrigin: '50%', x, y}}
                                    fill="white"
                                />
                            </clipPath>
                        </defs>
                        <rect
                            {...logoAnimation.viewBox}
                            fill={`url(${BR_BRAND_GRADIENT_HREF})`} clipPath={`url(#${ANIMATED_LOGO_CLIP_PATH_ID})`}
                        ></rect>
                    </motion.svg>
                </div>
            </div>

            <div css={css`
                grid-column: 1 / -1;
                text-align: center;
                h2 {
                    margin-block-end: 0.25em;
                }
                //text-shadow: 0 0 2px var(--muted-foreground);
            `}>
                <h2 className="section-title">Meet TechKun</h2>
                <p className="section-subtitle">where we give your product an&nbsp;identity.</p>
            </div>
        </div>
    </section>;
};