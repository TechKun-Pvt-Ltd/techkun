'use client'
import React, {ReactNode} from "react";
import {css, keyframes} from "@emotion/react";
import {Easing, mapEasingToNativeEasing, motion} from "motion/react";
import cssSupports from "@/app/utils/css-supports";
import BANNER_ANIMATION from "@/app/animations/banner";

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

const gradientFill = keyframes`
    from {
        --gradient-fill-progress: 0%;
    }
    to {
        --gradient-fill-progress: 50%;
    }
`;

const { ctaBorderGradient } = BANNER_ANIMATION;

export default function GradientBorderButton({children, className, ...props}: {
    children: ReactNode;
} & React.ComponentPropsWithoutRef<typeof motion.button>) {
    const buttonCss = css`
        color: var(--foreground);
        padding-block: 0.8rem;
        padding-inline: 1.6rem 1.4rem;
        border-radius: 0.8rem;

        &::before {
            background: linear-gradient(
                -2deg,
                var(--secondary-950) -25%,
                transparent var(--gradient-fill-progress)
            );
        }
        &::after {
            border: 1px solid transparent;
            mask:
                padding-box linear-gradient(transparent 0 0) subtract,
                border-box linear-gradient(black 0 0);
                //border-box linear-gradient(var(--gradient-angle), black 10%, transparent 30%, transparent 70%, black 90%);
            background: linear-gradient(
                -2deg,
                var(--secondary-700),
                var(--secondary-950) var(--gradient-fill-progress)
            ) border-box;
            //background: linear-gradient(
            //    var(--gradient-angle),
            //    var(--tertiary-500),
            //    var(--secondary-500),
            //    var(--primary-500) 25%,
            //    var(--primary-500) 75%,
            //    var(--secondary-500),
            //    var(--tertiary-500)
            //) padding-box;
        }
        &::before, &::after {
            animation: ${gradientFill} ${ctaBorderGradient.duration}s ${ctaBorderGradient.delay}s ease-out both;
        }

        & > svg {
            margin-inline-start: 0.4375em;
            width: 0.6em;
        }
        
        & .arrow {
            transition: d ${transition.duration}s ${mapEasingToNativeEasing(transition.ease, transition.duration)};
        }
        &:hover .arrow, &:focus-visible .arrow {
            d: path("${variants[FOCUSED].d}");
        }
    `;

    return <motion.button
        className={"tri-layered-button " + className}
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