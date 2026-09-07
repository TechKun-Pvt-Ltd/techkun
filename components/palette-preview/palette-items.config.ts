import colorNames from "@/app/styles/theme/color-names.static.mjs";
import type { PaletteItemKey } from "./types";

export const PALETTE_ITEM_KEYS: PaletteItemKey[] = [
    "primary",
    "secondary",
    "tertiary",
    "secondaryNeutral",
    "neutral",
];

export const TINTS_SHADES_STEPS = 5;
export const INTERPOLATED_STEPS = 10;

export interface ShadesTintsItemConfig {
    type: "shades-tints";
    label: string;
    baseColorVar: string;
    defaultWhiteColor: string;
    defaultBlackColor: string;
    defaultMixStrength: number;
    steps: number;
}

export interface InterpolatedItemConfig {
    type: "interpolated";
    label: string;
    startColorVar: string;
    endColorVar: string;
    includeEnds: boolean;
    steps: number;
}

export type PaletteItemConfig = ShadesTintsItemConfig | InterpolatedItemConfig;

export const PALETTE_ITEM_CONFIG: Record<PaletteItemKey, PaletteItemConfig> = {
    primary: {
        type: "shades-tints",
        label: "Primary",
        baseColorVar: "var(--primary-color)",
        defaultWhiteColor: "white",
        defaultBlackColor: "black",
        defaultMixStrength: 0.7,
        steps: TINTS_SHADES_STEPS,
    },
    secondary: {
        type: "shades-tints",
        label: "Secondary",
        baseColorVar: "var(--secondary-color)",
        defaultWhiteColor: "white",
        defaultBlackColor: "black",
        defaultMixStrength: 0.7,
        steps: TINTS_SHADES_STEPS,
    },
    tertiary: {
        type: "shades-tints",
        label: "Tertiary",
        baseColorVar: "var(--tertiary-color)",
        defaultWhiteColor: "white",
        defaultBlackColor: "black",
        defaultMixStrength: 0.7,
        steps: TINTS_SHADES_STEPS,
    },
    secondaryNeutral: {
        type: "shades-tints",
        label: "Secondary Neutral",
        baseColorVar: "var(--secondary-neutral-color)",
        defaultWhiteColor: "oklch(1 0.05 var(--secondary-hue))",
        defaultBlackColor: "oklch(0 0.05 var(--secondary-hue))",
        defaultMixStrength: 0.8,
        steps: TINTS_SHADES_STEPS,
    },
    neutral: {
        type: "interpolated",
        label: "Neutral",
        startColorVar: "var(--neutral-50)",
        endColorVar: "var(--neutral-950)",
        includeEnds: false,
        steps: INTERPOLATED_STEPS,
    },
};

export function getVarNames(key: PaletteItemKey): string[] {
    return colorNames[key] ?? [];
}