import {ReactNode} from "react";
import {css} from "@emotion/react";

export default function Button({children, textColor, backgroundColor}: {
    children: ReactNode;
    textColor: string;
    backgroundColor: string;
}) {
    return <button css={css`
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

        &>svg {
            margin-left: 0.4375em;
            width: 0.6em;
            &>path {
                d: path("M1 1l4 4-4 4 m4 -4h0");
                transition: d 0.15s cubic-bezier(0.215,0.61,0.355,1);
            }
        }
        &:hover > svg > path {
            d: path("M5 1l4 4-4 4 m4 -4h-8");
        }
    `}>
        {children}
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l4 4-4 4 m4 -4h0"></path>
        </svg>
    </button>;
}