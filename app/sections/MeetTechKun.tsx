'use client';
import {css} from "@emotion/react";
import React, {useEffect} from "react";
import logoAnimation from "@/public/logo-animation.json";
import {viewBoxString} from "@/app/utils/graphics-utils";
import {inView, motion, useAnimate, useMotionValue} from "motion/react";
import {BR_BRAND_GRADIENT_HREF} from "@/app/Shared";

const ANIMATED_LOGO_CLIP_PATH_ID = "animated-logo-clip-path";

export default function MeetTechKun() {
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const x = useMotionValue('0%');
    const y = useMotionValue('0%');
    useEffect(() => {
        const heading = scope.current.querySelector('h2');
        const path = scope.current.querySelector("path");
        const rect = scope.current.querySelector('rect');
        const flying = scope.current.querySelectorAll(".flying");

        const delays = Array.from({ length: flying.length }, (_, i) => 1.5 * (i % 5) / 5 + 0.5 * Math.random());
        const dynamicDelayFn = (i: number) => delays[i];

        inView(heading, () => {
            animate([
                [flying, {
                    transform: "translate(0, 0) scale(0.5)",
                }, {
                    //type: "spring", visualDuration: 1.5, bounce: 0.2
                    duration: 2,
                    ease: [0.995, -0.035, 0.945, 0.923],
                    delay: dynamicDelayFn
                }],
                [flying, {
                    opacity: [0, 1, 1, 0]
                }, {
                    //type: "spring", visualDuration: 1.5, bounce: 0.2
                    duration: 2,
                    times: [0, 0.6, 0.9, 1],
                    ease: "easeInOut",
                    delay: dynamicDelayFn,
                    at: '<'
                }],
                [rect, { opacity: 1 }, {
                    duration: 2.25,
                    ease: [0.995, -0.035, 0.945, 0.923],
                    at: '<+1.5'
                }],
                [path, { scale: 1 }, {
                    type: "spring",
                    visualDuration: 0.5,
                    bounce: 0.4,
                    at: "-0.25"
                }],
                [path, { x: "0%", y: "0%" }, { type: "spring", duration: 1.5, bounce: 0.1, at: '-0.25' }],
                [
                    path, { d: logoAnimation.frames.map(f => f.value) },
                    { duration: logoAnimation.duration, ease: 'linear', at: '-0.75'}
                ]
            ]);
        });
    }, []);

    useEffect(() => {
        const path = scope.current.querySelector("path")!;

        const pathBBox = path.getBBox();
        const {viewBox} = logoAnimation;
        const currentX = (pathBBox.x - viewBox.x) + pathBBox.width / 2;
        const currentY = (pathBBox.y - viewBox.y) + pathBBox.height / 2;
        const targetX = viewBox.width / 2;
        const targetY = viewBox.height / 2;
        x.set(`${((targetX - currentX) / pathBBox.width * 100)}%`);
        y.set(`${((targetY - currentY) / pathBBox.height * 100)}%`);
    }, []);

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
                <div css={css`
                    position: absolute;
                    filter: drop-shadow(0 0 3px var(--secondary-neutral-50));

                    .flying {
                        position: absolute;
                        width: 3px;
                        height: 3px;
                        background: var(--secondary-neutral-50);
                        border-radius: 50%;
                        transform-origin: center;
                    }
                `}>
                    {Array.from({length: 50}, (_, i) =>
                        <motion.div
                            key={i} className="flying"
                            initial={{
                                opacity: 0,
                                transform: 'translate(' +
                                    'calc(cos(var(--angle)) * var(--radius))' + ', ' +
                                    'calc(sin(var(--angle)) * var(--radius) * 0.5)' +
                                    ') ' + 'scale(1)'
                            }}
                            style={{
                                '--radius': (200 + 400 * Math.random()) + 'px',
                                '--angle': (i / 50 * 360 - 15 + 30 * Math.random()) + 'deg'
                            } as React.CSSProperties}
                            suppressHydrationWarning
                        ></motion.div>
                    )}
                </div>
                <div css={css`
                    width: clamp(240px, 75%, 400px);
                `}>
                    <svg style={{ display: "block" }} viewBox={viewBoxString(logoAnimation.viewBox)}>
                        <defs>
                            <clipPath id={ANIMATED_LOGO_CLIP_PATH_ID}>
                                <motion.path d={logoAnimation.frames[0].value}
                                    style={{transformOrigin: 'center', x, y, scale: 0.625}}
                                    fill="white"
                                />
                            </clipPath>
                        </defs>
                        <motion.rect
                            {...logoAnimation.viewBox}
                            fill={`url(${BR_BRAND_GRADIENT_HREF})`} clipPath={`url(#${ANIMATED_LOGO_CLIP_PATH_ID})`}
                            initial={{ opacity: 0 }}
                        ></motion.rect>
                    </svg>
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