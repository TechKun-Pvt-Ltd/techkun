// “”
'use client';
import {css} from "@emotion/react";
import React, {useEffect} from "react";
import logoAnimation from "@/public/logo-animation.json";
import {viewBoxString} from "@/app/utils/graphics-utils";
import {inView, motion, useAnimate, useMotionValue} from "motion/react";
import {device} from "@/app/styles/device-breakpoints";

const LOGO_OFFSET = 0.04;

export default function MeetTechKun() {
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const x = useMotionValue('0%');
    const y = useMotionValue('0%');
    useEffect(() => {
        const heading = scope.current.querySelector('h2');
        const path = scope.current.querySelector("path");
        const flying = scope.current.querySelectorAll(".flying");

        inView(heading, () => {
            animate([
                [flying, { transform: "translate(0, 0) scale(0.5)", opacity: 0 }, { duration: 1, ease: 'easeIn' }],
                [path, { scale: 1, opacity: 1 }, { duration: 1, ease: 'easeOut', at: 0.25 }],
                [path, { x: "0%", y: "0%" }, { duration: 1, ease: 'easeInOut' }],
                [
                    path, { d: logoAnimation.frames.map(f => f.value) },
                    { duration: logoAnimation.duration, ease: 'linear', at: '-0.5'}
                ]
            ]);
        });
    }, []);

    useEffect(() => {
        const path = scope.current.querySelector("path")!;

        const pathBBox = path.getBBox();
        const currentX = pathBBox.x + pathBBox.width / 2;
        const currentY = pathBBox.y + pathBBox.height / 2;
        const {viewBox} = logoAnimation;
        const targetX = viewBox.width / 2 + LOGO_OFFSET * viewBox.width;
        const targetY = viewBox.height / 2;
        x.set(`${((targetX - currentX) / pathBBox.width * 100)}%`);
        y.set(`${((targetY - currentY) / pathBBox.height * 100)}%`);
    }, []);

    return <section css={css`
        //@property --radial-grad-height {
        //    syntax: "<length-percentage>";
        //    inherits: false;
        //    initial-value: 100%;
        //}
        //@keyframes morph-grad {
        //    50% {
        //        --radial-grad-height: 50%;
        //    }
        //    100% {
        //        --radial-grad-height: 100%;
        //    }
        //}
        align-items: center;
        position: relative;
        isolation: isolate;
        //margin-block-end: -144px;
        &::before {
            content: '';
            z-index: -1;
            position: absolute;
            inset: 0;
            background: radial-gradient(
                ellipse var(--page-width) 75% at 50% 50%,
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
            //animation: morph-grad 4s infinite ease-in-out;
        }
    `}>
        <div ref={scope} css={css`
            height: max-content;
            display: grid;
            grid-template-columns: subgrid;
            row-gap: 96px;
            padding-block: 640px;
        `}>
            <div css={css`
                grid-column: 1 / -1;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                isolation: isolate;

                & .flying {
                    position: absolute;
                    z-index: -1;
                    width: 48px;
                    height: 48px;
                    background: oklch(0.2 0.15 calc(var(--i) / 4 * 360));
                    --radius: 450px;
                    --angle: calc(45deg + var(--i) / 4 * -270deg);
                }
            `}>
                <div css={css`
                    width: 90%;
                    @media ${device.mobileM} {
                        width: 70%;
                    }
                    @media ${device.tablet} {
                        width: 50%;
                    }
                    @media ${device.laptop} {
                        width: 30%;
                    }
                `}>
                    <svg viewBox={viewBoxString(logoAnimation.viewBox)}
                         css={css`
                             transform: translateX(-${LOGO_OFFSET * 100}%);
                         `}
                    >
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--primary-500)" />
                                <stop offset="50%" stopColor="var(--primary-500)" />
                                <stop offset="75%" stopColor="oklch(from var(--primary-500) l c calc(h + 20))" />
                                <stop offset="100%" stopColor="oklch(from var(--primary-500) l c calc(h + 40))" />
                            </linearGradient>
                            <mask id="animated-logo-mask">
                                {/*<rect x="0%" y="0%" width="100%" height="100%" fill="black"></rect>*/}
                                <motion.path d={logoAnimation.frames[0].value}
                                    initial={{opacity: 0}}
                                    style={{x, y, scale: 0.5}}
                                    fill="white"
                                />
                            </mask>
                        </defs>
                        <rect x="0%" y="0%" width="100%" height="100%"
                              fill="url(#gradient)" mask="url(#animated-logo-mask)"
                        ></rect>
                    </svg>
                </div>
                {Array.from({length: 5}, (_, i) =>
                    <motion.div key={i} className="flying"
                        initial={{
                            transform: 'translate(' +
                                'calc(cos(var(--angle)) * var(--radius))' + ', ' +
                                'calc(sin(var(--angle)) * var(--radius))' +
                            ') ' + 'scale(1)'
                        }}
                        style={{ '--i': i } as any}
                    ></motion.div>
                )}
            </div>

            <h2 css={css`
                grid-column: 1 / -1;
                text-align: center;
                //text-shadow: 0 0 2px var(--muted-foreground);
            `}>Meet TechKun,<br/>where we give your product an identity.</h2>
        </div>
    </section>;
};