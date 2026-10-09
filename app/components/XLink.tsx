import Link from "next/link";
import React from "react";
import {gradientColor1, gradientColor2} from "@/app/utils/css/custom-properties";
import {css} from "@emotion/react";
import LogoX from "@/iconography/glyphs/logo-x";

const linkCss = css`
    transition: 0.3s var(--ease-out-cubic);
    transition-property: ${gradientColor1}, ${gradientColor2};
    ${gradientColor1}: currentColor;
    ${gradientColor2}: currentColor;
    &:hover, &:focus-visible {
        ${gradientColor1}: var(--color-brand-1);
        ${gradientColor2}: var(--color-brand-3);
    }
`;
export default function XLink(props: React.ComponentProps<typeof Link>) {
    return <Link
        target="_blank" rel="noopener noreferrer"
        aria-label="Find us on X"
        css={linkCss} {...props}
    >
        <LogoX style={{ display: "block" }} />
    </Link>
}