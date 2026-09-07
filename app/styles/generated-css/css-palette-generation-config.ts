import type {EasingFunction} from "times-fps";
import colorRampsStatic from "../theme/color-ramps.static.mjs";

export interface TintsShadesGenerationConfig {
    baseColor: string;
    mixStrength: number | { tints: number; shades: number; };
    steps?: number | { tints: number; shades: number; };
    easing?: EasingFunction | { tints: EasingFunction; shades: EasingFunction };
    whiteOverride?: string;
    blackOverride?: string;
}

export interface GenericColorRampGenerationConfig {
    startColor: string;
    endColor: string;
    steps?: number;
    easing?: EasingFunction;
}

export type ColorRampKey = keyof typeof colorRampsStatic;
export const COLOR_RAMP_KEYS = Object.keys(colorRampsStatic) as ColorRampKey[];

export const ColorRampType = {
    TINTS_SHADES: 'tints-shades',
    DEFAULT: 'default'
} as const;

export type ColorRampGenerationConfig =
    | (TintsShadesGenerationConfig & { type: typeof ColorRampType.TINTS_SHADES })
    | (GenericColorRampGenerationConfig & { type: typeof ColorRampType.DEFAULT });
export type PaletteGenerationConfig = Record<ColorRampKey, ColorRampGenerationConfig>;