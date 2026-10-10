import {cubicBezierEasing} from "times-fps";
import {colorSchema} from "../spec.ts";
import type {GroupedPrimitiveValues, RampKey} from "../spec.ts";
import type {Seed} from "../custom-properties.ts";
import {seedVar} from "./seeds.ts";
import {generateRampSteps} from "../../../styling-system/color-system/generation/generate.ts";
import type {RampGenerationConfig} from "../../../styling-system/color-system/generation/config.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

const brandEasing = {
    tints: cubicBezierEasing(0.3, 0.2, 1, 1),
    shades: cubicBezierEasing(0, 0, 0.7, 0.8)
};
function brandRamp(hue: Seed): RampGenerationConfig {
    return {
        type: "tints-shades",
        baseColor: `oklch(${seedVar("brand-lightness")} ${seedVar("brand-chroma")} ${seedVar(hue)})`,
        mixStrength: 0.65,
        easing: brandEasing
    };
}
const rampConfigs: Record<RampKey, RampGenerationConfig> = {
    "brand-1": brandRamp("brand-1-hue"),      // Mariner
    "brand-2": brandRamp("brand-2-hue"),      // Royal Blue
    "brand-3": brandRamp("brand-3-hue"),      // Fuchsia Blue
    // Gray
    neutral: {
        type: "blend",
        startColor: `oklch(0.9 0.005 ${seedVar("brand-2-hue")})`,
        endColor: `oklch(0.1 0.005 ${seedVar("brand-2-hue")})`
    },
    // Comet
    "neutral-tinted": {
        type: "tints-shades",
        baseColor: `oklch(0.5 0.05 ${seedVar("brand-2-hue")})`,
        whiteOverride: `oklch(1 0.05 ${seedVar("brand-2-hue")})`,
        blackOverride: `oklch(0 0.05 ${seedVar("brand-2-hue")})`,
        mixStrength: 0.8
    }
};

const primitiveValues = ObjectStream.of(colorSchema.primitive)
    .mapEntryToValue((rampKey, steps) => generateRampSteps(rampConfigs[rampKey], Object.keys(steps)))
    .collect() as GroupedPrimitiveValues;
export default primitiveValues;
