/** @jsxImportSource react */
import TechKunLogoSvgSquareIcon from "@/app/dev-private/(photos)/TechKunLogoSvgSquareIcon.tsx";
import React from "react";

const xPadding = 15.8;
const xOffset = 0.5;
const yOffset = 2;

export default function ProfilePhotoRect() {
    return <TechKunLogoSvgSquareIcon
        xPadding={xPadding} xOffset={xOffset} yOffset={yOffset}
        style={{backgroundColor: "var(--background)"}}
    />;
}