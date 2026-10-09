'use client'
import React, {ReactNode} from "react";
import {css} from "@emotion/react";
import {motion} from "motion/react";
import ArrowRight from "@/iconography/glyphs/arrow-right";

const buttonCss = css`
    color: var(--color-text-btn-primary);
    /* The arrow's stroke, in grid units, matched to the label's weight. */
    background: transparent;
    padding-block: 0.75rem;
    padding-inline: 1.6em 1.4em;
    //border-radius: 0.75rem;
    border-radius: var(--radius-full);
    corner-shape: superellipse(1.1);
    //font-weight: var(--font-weight-semibold);

    &::before {
        background: var(--color-bg-btn-primary) padding-box;
    }
    //&::before, &::after {
    //    border: 1px solid transparent;
    //}

    & > svg {
        margin-inline-start: 0.4375em;
    }
`;

export default function MainCTA(
    {children, className, ...props}: { children: ReactNode; } & React.ComponentPropsWithoutRef<typeof motion.button>
) {
    return <motion.button
        className={["bi-layered-button", ArrowRight.host, className].filter(Boolean).join(" ")}
        css={buttonCss}
        // Drives the glyph's motion fallback where CSS `d` transitions aren't supported.
        {...ArrowRight.motionHost}
        {...props}
    >
        {children}
        <ArrowRight size="0.6em" strokeWidth={3.5} />
    </motion.button>;
};