import {ReactNode} from "react";
import {css} from "@emotion/react";
import { motion } from "motion/react";

const INITIAL = "initial";
const FOCUSED = "focused";

const variants = {
    [INITIAL]: { d: "M1 1l4 4-4 4 m4 -4h0" },
    [FOCUSED]: { d: "M5 1l4 4-4 4 m4 -4h-8" }
};

export default function Button({children, textColor, backgroundColor}: {
    children: ReactNode;
    textColor: string;
    backgroundColor: string;
}) {
    return <motion.button
        css={css`
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
        `}
        initial={INITIAL}
        whileHover={FOCUSED} whileFocus={FOCUSED} whileTap={FOCUSED}
    >
        {children}
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.path className="arrow"
                variants={variants}
                transition={{
                    duration: 0.15,
                    ease: [0.215, 0.61, 0.355, 1]
                }}
            ></motion.path>
        </svg>
    </motion.button>;
}