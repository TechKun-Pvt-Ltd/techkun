'use client';
import React from "react";
import logoPath from "@/public/logo-path.json";
import {css, Global} from "@emotion/react";
import {device} from "@/app/styles/device-breakpoints";

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
                @media ${device.mobileL} {
                    --page-padding: 24px;
                }
                @media ${device.tablet} {
                    --page-padding: 32px;
                }
            }
        `} />
        <svg xmlns="http://www.w3.org/2000/svg"
             width="0" height="0" style={{gridArea: 'none', position: 'absolute'}}
        >
            <path id="logo-path" d={logoPath.value} />
            <clipPath id="logo-clip-path">
                <use href="#logo-path"></use>
            </clipPath>
        </svg>
    </>;
}