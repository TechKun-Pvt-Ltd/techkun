'use client'
import React, {ReactNode} from "react";
import {css} from "@emotion/react";
import {Easing, mapEasingToNativeEasing, motion} from "motion/react";
import cssSupports from "@/app/utils/css/supports";

const INITIAL = "initial";
const FOCUSED = "focused";

const variants = {
    [INITIAL]: { d: "m 2 4 l 8 8 l -8 8 m 8 -8 h 0" },
    [FOCUSED]: { d: "m 14 4 l 8 8 l -8 8 m 8 -8 h -20" }
};
const transition: {
    duration: number;
    ease: Easing;
} = {
    duration: 0.15,
    ease: [0.215, 0.61, 0.355, 1]
};

const buttonCss = css`
    color: var(--secondary-50);
    background: transparent;
    padding-block: 0.8rem;
    padding-inline: 1.6em 1.4em;
    //border-radius: 0.75rem;
    border-radius: 100vh;
    corner-shape: superellipse(1.1);
    //font-weight: 600;

    &::before {
        background: var(--secondary-900) padding-box;
    }
    //&::before, &::after {
    //    border: 1px solid transparent;
    //}

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

export default function MainCTA(
    {children, className, ...props}: { children: ReactNode; } & React.ComponentPropsWithoutRef<typeof motion.button>
) {
    return <motion.button
        className={"bi-layered-button " + className}
        css={buttonCss} initial={INITIAL}
        whileHover={FOCUSED} whileFocus={FOCUSED} whileTap={FOCUSED}
        {...props}
    >
        {children}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path className="arrow"
                d={variants[INITIAL].d}
                {...(cssSupports.d ? null : { variants, transition })}
            ></motion.path>
        </svg>
    </motion.button>;
};