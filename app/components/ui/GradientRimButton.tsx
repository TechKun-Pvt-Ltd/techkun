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
        --gradient-angle: -30deg;
    }
    to {
        --gradient-angle: -160deg;
    }
`;

export default function GradientRimButton({children, ...props}: {
    children: ReactNode;
} & React.ComponentPropsWithoutRef<typeof motion.button>) {
    const buttonCss = css`
        color: var(--foreground);
        background-color: transparent;
        position: relative;
        isolation: isolate;
        padding-block: 0.8rem;
        padding-inline: 1.6rem 1.4rem;
        border-radius: 0.8rem;

        animation: ${rotateMaskGradient} linear both;
        animation-timeline: view();
        animation-range-start: contain 50%;

        &::before, &::after {
            content: '';
            border-radius: inherit;
            corner-shape: inherit;
            position: absolute;
            inset: 0;
        }
        &::before {
            z-index: -2;
            border: 1px solid var(--muted);
            transition: transform 0.1s ease-in-out;
        }
        &::after {
            z-index: -1;
            border: 1px solid transparent;
            mask:
                content-box linear-gradient(transparent 0 0) subtract,
                border-box linear-gradient(var(--gradient-angle), black 5%, transparent 25%, transparent 75%, black 95%);
            background: linear-gradient(
                var(--gradient-angle),
                var(--tertiary-500),
                var(--secondary-500),
                var(--primary-500) 25%,
                var(--primary-500) 75%,
                var(--secondary-500),
                var(--tertiary-500)
            ) border-box;
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
            <motion.path className="arrow"
                d={variants[INITIAL].d}
                {...(cssSupports.d ? null : { variants, transition })}
            ></motion.path>
        </svg>
    </motion.button>;
}