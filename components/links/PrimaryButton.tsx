'use client';
import {css} from "@emotion/react";
import React from "react";
import ButtonLink from "@/components/links/ButtonLink.tsx";
import ArrowRight from "@/iconography/glyphs/arrow-right";

const primaryCss = css`
    color: var(--color-text-btn-primary);
	font-weight: var(--font-weight-medium);

    &::before {
        background: var(--color-bg-btn-primary) padding-box;
    }
`;

export default function PrimaryButton(
	{external = true, ...props}: Omit<React.ComponentProps<typeof ButtonLink>, "icon">
) {
	return <ButtonLink icon={ArrowRight} external={external} css={primaryCss} {...props} />;
}
