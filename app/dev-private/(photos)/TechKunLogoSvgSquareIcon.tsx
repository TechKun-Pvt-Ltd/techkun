/** @jsxImportSource react */
import React from "react";
import {viewBoxString} from "@/app/utils/graphics-utils.ts";
import logoPath from "@/public/logo-path.json";

export default function TechKunLogoSvgSquareIcon({xPadding = 15, xOffset = 0.5, yOffset = 2, ...props}: { xPadding?: number; xOffset?: number; yOffset?: number; } & React.ComponentProps<"svg">) {
    return <svg
        width="400" viewBox="0 0 400 400"
        style={{
            // border: "2px solid var(--border)",
            // outline: "1px dashed var(--border)", outlineOffset: "-56px"
        }}
        {...props}
    >
        {/*<line x1="0%" y1="50%" x2="100%" y2="50%" strokeWidth="2" stroke="var(--border)" />*/}
        {/*<line x1="50%" y1="0%" x2="50%" y2="100%" strokeWidth="2" stroke="var(--border)" />*/}
        {/*<line x1={`${xPadding}%`} y1="0%" x2={`${xPadding}%`} y2="100%" strokeWidth="2" stroke="var(--border)" />*/}
        {/*<line x1={`${100 - xPadding}%`} y1="0%" x2={`${100 - xPadding}%`} y2="100%" strokeWidth="2" stroke="var(--border)" />*/}
        <svg
            x={`${xPadding + xOffset}%`} y={`${yOffset}%`}
            width={`${100 - 2 * xPadding}%`} height="100%"
            viewBox={viewBoxString(logoPath.viewBox)}
        >
            <path d={logoPath.value} fill="var(--primary-color)" />
        </svg>
    </svg>;
}