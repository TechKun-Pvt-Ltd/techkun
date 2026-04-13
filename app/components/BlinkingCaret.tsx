import {css, keyframes} from "@emotion/react";
import React, {forwardRef, useImperativeHandle, useRef} from "react";

const blink = keyframes`
    to {
        visibility: hidden;
    }
`;

export type BlinkingCaretControls = {
    toggle(): void;
};

export default forwardRef<BlinkingCaretControls>(function BlinkingCaret(_, ref) {
    const caretRef = useRef<HTMLSpanElement>(null);
    useImperativeHandle(ref, () => ({
        toggle() {
            caretRef.current!.toggleAttribute("data-typing");
        }
    }), []);

    return <span ref={caretRef} css={css`
        display: inline-block;
        width: 2px;
        height: 0.9em;
        background-color: currentColor;
        position: relative;
        top: 0.1em;
        left: 0.2em;
        background: var(--primary-500);
        animation: ${blink} 1s steps(2, start) infinite;

        &[data-typing] {
            animation: none;
            visibility: visible;
        }
    `}></span>;
});