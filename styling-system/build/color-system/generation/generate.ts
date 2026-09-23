import {round} from "svg-path-kit/numbers";
import type {EasingFunction} from "times-fps";
import type {BlendConfig, PerSide, RampGenerationConfig, TintsShadesConfig} from "./config.ts";
import type {CSSValue} from "../../shared/types.ts";

/* Turns one ramp's config into its ordered list of colors, lightest first. Knows nothing about what the ramp
   or its steps are called - the caller zips the list with its step names. */

export function generateRamp(config: RampGenerationConfig, count: number): CSSValue[] {
    return config.type === "tints-shades" ? generateTintsShades(config, count) : generateBlend(config, count);
}

function linear(t: number) { return t; }

function colorMix(color: string, mixColor: string, fraction: number): CSSValue {
    return `color-mix(in oklch, ${color}, ${mixColor} ${round(Math.max(fraction, 0) * 100, 1e-4)}%)`;
}

// Easings are functions and strengths are numbers, so an object is always the per-side form.
function perSide<T extends number | EasingFunction>(value: PerSide<T>, side: "tints" | "shades"): T {
    return typeof value === "object" ? value[side] : value;
}

function generateTintsShades(
    {baseColor, mixStrength, easing = linear, tints: tintsCount, whiteOverride, blackOverride}: TintsShadesConfig,
    count: number
): CSSValue[] {
    const tintsTotal = tintsCount ?? Math.floor((count - 1) / 2);
    const shadesTotal = count - 1 - tintsTotal;
    if (tintsTotal < 0 || shadesTotal < 0) throw new Error(`A tints-shades ramp of ${count} steps can't have ${tintsTotal} tints.`);

    const tintsEasing = perSide(easing, "tints");
    const shadesEasing = perSide(easing, "shades");
    const tintsStrength = perSide(mixStrength, "tints");
    const shadesStrength = perSide(mixStrength, "shades");

    const tints = Array.from({length: tintsTotal}, (_, i) =>
        colorMix(baseColor, whiteOverride ?? "white", tintsEasing(1 - i / tintsTotal) * tintsStrength)
    );
    const shades = Array.from({length: shadesTotal}, (_, i) =>
        colorMix(baseColor, blackOverride ?? "black", shadesEasing((i + 1) / shadesTotal) * shadesStrength)
    );
    return [...tints, baseColor, ...shades];
}

function generateBlend({startColor, endColor, easing = linear}: BlendConfig, count: number): CSSValue[] {
    const last = count - 1;
    return Array.from({length: count}, (_, i) =>
        i === 0 ? startColor :
        i === last ? endColor :
        colorMix(startColor, endColor, easing(i / last))
    );
}
