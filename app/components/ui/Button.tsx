'use client'
import React, {ReactNode} from "react";
import {css} from "@emotion/react";
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

export default function Button({children, textColor, backgroundColor, ...props}: {
    children: ReactNode;
    textColor: string;
    backgroundColor: string;
} & React.ComponentPropsWithoutRef<typeof motion.button>) {
    const buttonCss = css`
        color: ${textColor};
        background-color: transparent;
        //text-shadow: 1px 2px 2px var(--neutral-500);
        position: relative;
        isolation: isolate;

        padding-inline: 1.25rem 1rem;

        &::before {
            content: '';
            border-radius: inherit;
            background-color: ${backgroundColor};
            position: absolute;
            inset: 0;
            z-index: -1;
            transition-property: transform, opacity;
            transition-duration: 0.1s, 0.3s;
            transition-timing-function: ease-in-out;
        }
        &:hover::before {
            opacity: 0.8;
        }

        &:active::before {
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