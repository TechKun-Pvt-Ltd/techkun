/** @jsxImportSource react */
import TechKunLogoSvgSquareIcon from "@/app/dev-private/(photos)/TechKunLogoSvgSquareIcon.tsx";
import React from "react";

type Config = React.ComponentProps<typeof TechKunLogoSvgSquareIcon>;

const opticalAlignmentSettings = {xPadding: 15.8, xOffset: 0.5, yOffset: 2};
const variants = {
    fallback: opticalAlignmentSettings,
    // Google's admin console displays the logo at 320 × 132; rendered at 4× for a sharp screenshot.
    "admin-console": {...opticalAlignmentSettings, width: 320 * 4, height: 132 * 4},
} satisfies Record<string, Config>;

function variantProps(variant?: string | string[]): Config {
    if (typeof variant === "string" && Object.hasOwn(variants, variant))
        return variants[variant as keyof typeof variants];

    return variants.fallback;
}

export default async function ProfilePhotoRect({searchParams}: PageProps<"/dev-private/profile-photo-rect">) {
    const {variant} = await searchParams;

    return <TechKunLogoSvgSquareIcon
        {...variantProps(variant)}
        style={{backgroundColor: "var(--color-bg-canvas)"}}
    />;
}