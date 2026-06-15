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
            <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--primary-500)" />
                <stop offset="50%" stopColor="var(--primary-500)" />
                <stop offset="75%" stopColor="var(--secondary-500)" />
                <stop offset="100%" stopColor="var(--tertiary-500)" />
            </linearGradient>
            <path id="logo-path" d={logoPath.value} />
            <clipPath id="logo-clip-path">
                <use href="#logo-path"></use>
            </clipPath>
        </svg>
    </>;
}