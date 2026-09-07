import Link from "next/link";
import React, {useId} from "react";
import {gradientColor1, gradientColor2} from "@/app/utils/css/custom-properties";
import {X_LOGO_PATH_HREF} from "@/app/Shared";
import {css} from "@emotion/react";

const linkCss = css`
    transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-property: ${gradientColor1}, ${gradientColor2};
    ${gradientColor1}: currentColor;
    ${gradientColor2}: currentColor;
    &:hover, &:focus-visible {
        ${gradientColor1}: var(--primary-500);
        ${gradientColor2}: var(--tertiary-500);
    }
`;
export default function XLink(props: React.ComponentProps<typeof Link>) {
    const FILL_GRADIENT_ID = "x-fill-gradient" + useId();
    return <Link
        target="_blank" rel="noopener noreferrer"
        css={linkCss} {...props}
    >
        <svg className="link-icon" width="1em" viewBox="0 0 24 24" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={FILL_GRADIENT_ID} x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="20%" stopColor={`var(${gradientColor1})`} />
                    <stop offset="80%" stopColor={`var(${gradientColor2})`} />
                </linearGradient>
            </defs>
            <use href={X_LOGO_PATH_HREF} fill={`url(#${FILL_GRADIENT_ID})`} />
        </svg>
    </Link>
}