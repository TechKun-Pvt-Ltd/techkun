'use client'
import React, {ReactNode} from "react";
import {css, keyframes} from "@emotion/react";
import {Easing, mapEasingToNativeEasing, motion} from "motion/react";
import cssSupports from "@/app/utils/css-supports";

const INITIAL = "initial";
const FOCUSED = "focused";

const variants = {
    [INITIAL]: { d: "M1 1l4 4-4 4 m4 -4h0" },
    [FOCUSED]: { d: "M5 1l4 4-4 4 m4 -4h-8" }
};
const transition: {
    duration: number;
    ease: Easing;
} = {
    duration: 0.15,
    ease: [0.215, 0.61, 0.355, 1]
};

const rotateMaskGradient = keyframes`
    from {
        --gradient-angle: 160deg;
    }
    to {
        --gradient-angle: 10deg;
    }
`;

const brRadiusProp = "--_border-radius";
const outsetProp = "--_glow-outset";

export default function GradientRimButton({children, ...props}: {
    children: ReactNode;
} & React.ComponentPropsWithoutRef<typeof motion.button>) {
    const buttonCss = css`
        ${brRadiusProp}: 0.8rem;
        ${outsetProp}: 4px;
        color: var(--foreground);
        background-color: transparent;
        position: relative;
        isolation: isolate;
        padding-block: 0.8rem;
        padding-inline: 1.6rem 1.4rem;
        border-radius: var(${brRadiusProp});
        --gradient-angle: 160deg;

        @supports (animation-timeline: view()) {
            animation: ${rotateMaskGradient} linear both;
            animation-timeline: view();
            animation-range-start: cover 40%;
        }

        &::before, &::after {
            content: '';
            corner-shape: inherit;
            position: absolute;
            transition: transform 0.1s ease-in-out;
        }
        &::before {
            inset: 0;
            z-index: -2;
            border-radius: inherit;
            border: 1px solid var(--border);
        }
        &::after {
            inset: calc(-1 * var(${outsetProp}));
            z-index: -1;
            border: var(${outsetProp}) solid transparent;
            border-radius: calc(var(${brRadiusProp}) + var(${outsetProp}));
            padding: 1px;
            mask:
                content-box linear-gradient(transparent 0 0) subtract,
                border-box linear-gradient(black 0 0);
                //border-box linear-gradient(var(--gradient-angle), black 10%, transparent 30%, transparent 70%, black 90%);
            background: linear-gradient(
                -2deg,
                var(--secondary-500),
                var(--secondary-900) 50%
            ) padding-box;
            //background: linear-gradient(
            //    var(--gradient-angle),
            //    var(--tertiary-500),
            //    var(--secondary-500),
            //    var(--primary-500) 25%,
            //    var(--primary-500) 75%,
            //    var(--secondary-500),
            //    var(--tertiary-500)
            //) padding-box;
            //filter: url(#glow);
        }

        &:active::before, &:active::after {
            transform: scale(0.97);
        }

        & > svg {
            margin-inline-start: 0.4375em;
            width: 0.6em;
            //filter: drop-shadow(1px 2px 2px var(--neutral-500));
        }
        
        & .arrow {
            transition: d ${transition.duration}s ${mapEasingToNativeEasing(transition.ease, transition.duration)};
        }
        &:hover .arrow, &:focus-visible .arrow {
            d: path("${variants[FOCUSED].d}");
        }
    `;

    return <motion.button
        css={buttonCss} initial={INITIAL}
        whileHover={FOCUSED} whileFocus={FOCUSED} whileTap={FOCUSED}
        {...props}
    >
        {children}
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="BLUR" />
                    <feMerge>
                        <feMergeNode in="BLUR" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <motion.path className="arrow"
                d={variants[INITIAL].d}
                {...(cssSupports.d ? null : { variants, transition })}
            ></motion.path>
        </svg>
    </motion.button>;
}