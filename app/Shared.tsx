'use client';
import React from "react";
import logoPath from "@/public/logo-path.json";
import {css, Global} from "@emotion/react";
import {device} from "@/app/theme/device-breakpoints";
import {viewBoxString} from "@/app/utils/graphics-utils";

declare module "react" {
    interface HTMLAttributes<T> {
        xmlns?: string;
    }
}

export default function Shared() {
    return <>
        <Global styles={css`
            :root {
                --page-padding: 16px;
                @media ${device.mobileM} {
                    --page-padding: 32px;
                }

                @media ${device.tablet} {
                    --scale-ratio: 1.189;
                }
                //@media ${device.laptop} {
                    //--base-font-size: 1.125rem;
                //}
            }
        `} />
        <svg xmlns="http://www.w3.org/2000/svg"
             width="0" height="0" style={{gridArea: 'none', position: 'absolute'}}
             viewBox={viewBoxString(logoPath.viewBox)}
        >
            <path id="logo-path" d={logoPath.value} />
            <clipPath id="logo-clip-path">
                <use href="#logo-path"></use>
            </clipPath>
        </svg>
    </>;
}