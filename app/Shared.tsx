/** @jsxImportSource react */
import React from "react";
import logoPath from "@/public/logo-path.json";
import {viewBoxString} from "@/app/utils/graphics-utils";

declare module "react" {
    interface HTMLAttributes<T> {
        xmlns?: string;
    }
}

export default function Shared() {
    return <>
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