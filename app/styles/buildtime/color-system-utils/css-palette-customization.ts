import {
    type ColorRampKey,
    ColorRampType,
    type GenericColorRampGenerationConfig,
    type TintsShadesGenerationConfig
} from "./css-palette-generation-config.ts";
import {cubicBezierEasing, type CubicBezierEasingFunction} from "times-fps";

export type GenericColorRampCustomization = Omit<GenericColorRampGenerationConfig, "easing"> & {
    type: typeof ColorRampType.DEFAULT;
    easing?: CubicBezierEasingFunction;
};
export type TintsShadesCustomization = Omit<TintsShadesGenerationConfig, "easing"> & {
    type: typeof ColorRampType.TINTS_SHADES;
    easing?: CubicBezierEasingFunction | { tints: CubicBezierEasingFunction; shades: CubicBezierEasingFunction };
};

export const TINTS_SHADES_STEPS = 5;
export const BLEND_STEPS = 10;

export type ColorRampCustomization =
    | TintsShadesCustomization
    | GenericColorRampCustomization;

export type PaletteCustomization = Record<ColorRampKey, ColorRampCustomization>;

const easing = {
    tints: cubicBezierEasing(0.3, 0.2, 1, 1),
    shades: cubicBezierEasing(0, 0, 0.7, 0.8)
};
export const PALETTE_CUSTOMIZATION: PaletteCustomization = {
    primary: {
        type: ColorRampType.TINTS_SHADES,
        baseColor: "var(--primary-color)",
        mixStrength: 0.65,
        steps: TINTS_SHADES_STEPS,
        easing
    },
    secondary: {
        type: ColorRampType.TINTS_SHADES,
        baseColor: "var(--secondary-color)",
        mixStrength: 0.65,
        steps: TINTS_SHADES_STEPS,
        easing
    },
    tertiary: {
        type: ColorRampType.TINTS_SHADES,
        baseColor: "var(--tertiary-color)",
        mixStrength: 0.65,
        steps: TINTS_SHADES_STEPS,
        easing
    },
    secondaryNeutral: {
        type: ColorRampType.TINTS_SHADES,
        baseColor: "var(--secondary-neutral-color)",
        whiteOverride: "oklch(1 0.05 var(--secondary-hue))",
        blackOverride: "oklch(0 0.05 var(--secondary-hue))",
        mixStrength: 0.8,
        steps: TINTS_SHADES_STEPS,
    },
    neutral: {
        type: ColorRampType.DEFAULT,
        startColor: "var(--neutral-50)",
        endColor: "var(--neutral-950)",
        steps: BLEND_STEPS
    }
};