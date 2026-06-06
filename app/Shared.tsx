'use client';
import React from "react";
import logoPath from "@/public/logo-path.json";
import {css, Global} from "@emotion/react";
import {deviceBreakpoints} from "@/app/theme/device-breakpoints";
import {viewBoxString} from "@/app/utils/graphics-utils";

declare module "react" {
    interface HTMLAttributes<T> {
        xmlns?: string;
    }
}

export default function Shared() {
    return <>
        <Global styles={css`
            @layer viewport {
                :root {
                    --mobile-s: ${deviceBreakpoints.mobileS} !important;
                    --mobile-m: ${deviceBreakpoints.mobileM} !important;
                    --mobile-l: ${deviceBreakpoints.mobileL} !important;
                    --tablet: ${deviceBreakpoints.tablet} !important;
                    --laptop: ${deviceBreakpoints.laptop} !important;
                    --laptop-l: ${deviceBreakpoints.laptopL} !important;
                    --desktop: ${deviceBreakpoints.desktop} !important;
                }
            }
        `} />
        <svg xmlns="http://www.w3.org/2000/svg"
             width="0" height="0" style={{gridArea: 'none', position: 'fixed'}}
             viewBox={viewBoxString(logoPath.viewBox)}
        >
            <path id="logo-path" d={logoPath.value} />
            <clipPath id="logo-clip-path">
                <use href="#logo-path"></use>
            </clipPath>
        </svg>
    </>;
}