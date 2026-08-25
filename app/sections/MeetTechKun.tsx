'use client';
import {css} from "@emotion/react";
import React, {useEffect} from "react";
import logoAnimation from "@/public/logo-animation.json";
import {viewBoxString} from "@/app/utils/graphics-utils";
import {inView, motion, useAnimate} from "motion/react";
import {BR_BRAND_GRADIENT_HREF} from "@/app/Shared";
import useBrowser, {BrowserName} from "@/hooks/use-browser";

const ANIMATED_LOGO_CLIP_PATH_ID = "animated-logo-clip-path";

const STARS_COUNT = 50;

const sectionCss = css`
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
`;
const containerCss = css`
    height: max-content;
    display: grid;
    grid-template-columns: subgrid;
    row-gap: clamp(64px, 10vh, 96px);
    padding-block: 640px;
`;
const graphicsContainerCss = css`
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;
const starsContainerCss = css`
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
                --polar-angle: calc(var(--polar-angle-init) + 30deg);
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
`;
const animatedLogoCss = css`
    display: block;
    transform-origin: center;
    opacity: 0;
    @keyframes fade-in {
        to {
            opacity: 1;
        }
    }
    @keyframes shine {
        0%, 100% {
            filter: drop-shadow(0px 0px 0px var(--primary-color)) brightness(1);
        }
        49%, 51% {
            filter: drop-shadow(0px 0px 4px var(--primary-color)) brightness(3);
        }
    }
    animation:
        fade-in 2.25s 1.5s cubic-bezier(0.995, -0.035, 0.945, 0.923) both,
        shine 1.5s 2.75s ease-in-out both;
    animation-play-state: paused;
    &[data-animate] {
        animation-play-state: running;
    }
`;
export default function MeetTechKun() {
    const isStupidFirefox = useBrowser(BrowserName.STUPID_FIREFOX);
    const [starsMounted, setStarsMounted] = React.useState(true);
    const randomnessIndex = Array.from({ length: STARS_COUNT }, Math.random);

    const [scope, animate] = useAnimate<HTMLDivElement>();

    useEffect(() => {
        const heading = scope.current.querySelector('h2');
        const svg = scope.current.querySelector('svg.animated-logo-svg');
        const path = scope.current.querySelector<SVGPathElement>("path.animated-logo-path")!;
        const starsContainer = scope.current.querySelector(".stars-container");

        return inView(heading, () => {
            starsContainer?.toggleAttribute("data-animate");
            svg?.toggleAttribute("data-animate");
            const xValue = path.style.getPropertyValue("--x");
            const yValue = path.style.getPropertyValue("--y");
            animate([
                [svg, { scale: 1 }, {
                    type: "spring",
                    visualDuration: 0.5,
                    bounce: 0.4,
                    delay: 3.25
                }],
                [path, { '--x': [xValue, "0%"], '--y': [yValue, "0%"] }, { type: "spring", duration: 1.5, bounce: 0.1, at: '-0.5' }],
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
        const pathElement = scope.current.querySelector<SVGPathElement>("path.animated-logo-path")!;

        const pathBBox = isStupidFirefox ?
            scope.current.querySelector<SVGPathElement>("path.animated-logo-path-measurer")!.getBBox() :
            pathElement.getBBox();
        if (!pathBBox.width || !pathBBox.height) return;

        const {viewBox} = logoAnimation;
        const currentX = (pathBBox.x - viewBox.x) + pathBBox.width / 2;
        const currentY = (pathBBox.y - viewBox.y) + pathBBox.height / 2;
        const targetX = viewBox.width / 2;
        const targetY = viewBox.height / 2;
        pathElement.style.setProperty("--x", `${((targetX - currentX) / pathBBox.width * 100)}%`);
        pathElement.style.setProperty("--y", `${((targetY - currentY) / pathBBox.height * 100)}%`);
    }, [isStupidFirefox]);

    return <section css={sectionCss}>
        <div ref={scope} css={containerCss}>
            <div css={graphicsContainerCss}>
                {starsMounted && <div className="stars-container" css={starsContainerCss}>
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
                <div style={{ width: "clamp(240px, 75%, 400px)" }}>
                    <motion.svg
                        className="animated-logo-svg"
                        initial={{ scale: 0.625 }}
                        viewBox={viewBoxString(logoAnimation.viewBox)}
                        css={animatedLogoCss}
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
                                    style={{transformBox: 'fill-box', transformOrigin: '50%', transform: "translate(var(--x, 0), var(--y, 0))"}}
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

            <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                <h2 className="section-title" style={{ marginBlockEnd: "0.25em" }}>Meet TechKun</h2>
                <p className="section-subtitle">where we give your product an&nbsp;identity.</p>
            </div>
        </div>
    </section>;
};