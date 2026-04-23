'use client'
import {ReactNode} from "react";
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

export default function Button({children, textColor, backgroundColor}: {
    children: ReactNode;
    textColor: string;
    backgroundColor: string;
}) {
    const buttonCss = css`
        color: ${textColor};
        background-color: transparent;
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
            transition: transform 0.1s ease-in-out;
        }

        &:active::before {
            transform: scale(0.97);
        }

        & > svg {
            margin-left: 0.4375em;
            width: 0.6em;
        }
        
        & .arrow {
            transition: d ${transition.duration}s ${mapEasingToNativeEasing(transition.ease, transition.duration)};
        }
        &:hover .arrow, &:focus-visible .arrow {
            d: path("${variants[FOCUSED].d}");
        }
    `;

    return <motion.button css={buttonCss} initial={INITIAL}
        whileHover={FOCUSED} whileFocus={FOCUSED} whileTap={FOCUSED}
    >
        {children}
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.path className="arrow"
                d={variants[INITIAL].d}
                {...(cssSupports.d ? null : { variants, transition })}
            ></motion.path>
        </svg>
    </motion.button>;
}