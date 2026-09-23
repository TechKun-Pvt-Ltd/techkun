import {cubicBezierEasing} from "times-fps";
import {Palettes} from "./schema.ts";
import type {Palette, StepOf} from "./types.ts";
import {generateRamp} from "./generation/generate.ts";
import type {RampGenerationConfig} from "./generation/config.ts";
import type {CSSToken, CSSValue} from "../shared/types.ts";
import {createObjectFromEntries} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

// The brand's key color, as plain numbers for code that can't read CSS (icons, social cards).
export const SEED = {hue: 256, lightness: 0.56, chroma: 0.18} as const;

/* Seeds: not tokens and not part of the palette, just the standalone values the ramps are mixed from. */
export const seedValues = {
    brand1Hue: SEED.hue,
    brand2Hue: "calc(var(--color-brand-1-hue) + 20)",
    brand3Hue: "calc(var(--color-brand-1-hue) + 40)",
    brandLightness: SEED.lightness,
    brandChroma: SEED.chroma
} satisfies Record<string, CSSValue>;

const brandEasing = {
    tints: cubicBezierEasing(0.3, 0.2, 1, 1),
    shades: cubicBezierEasing(0, 0, 0.7, 0.8)
};
function brandRamp(hue: CSSToken): RampGenerationConfig {
    return {
        type: "tints-shades",
        baseColor: `oklch(var(--color-brand-lightness) var(--color-brand-chroma) var(${hue}))`,
        mixStrength: 0.65,
        easing: brandEasing
    };
}
const rampConfigs: Record<Palette, RampGenerationConfig> = {
    "brand-1": brandRamp("--color-brand-1-hue"),      // Mariner
    "brand-2": brandRamp("--color-brand-2-hue"),      // Royal Blue
    "brand-3": brandRamp("--color-brand-3-hue"),      // Fuchsia Blue
    // Gray
    neutral: {
        type: "blend",
        startColor: "oklch(0.9 0.005 var(--color-brand-2-hue))",
        endColor: "oklch(0.1 0.005 var(--color-brand-2-hue))"
    },
    // Comet
    "neutral-tinted": {
        type: "tints-shades",
        baseColor: "oklch(0.5 0.05 var(--color-brand-2-hue))",
        whiteOverride: "oklch(1 0.05 var(--color-brand-2-hue))",
        blackOverride: "oklch(0 0.05 var(--color-brand-2-hue))",
        mixStrength: 0.8
    }
};

type PrimitiveValues = { [P in Palette]: Record<StepOf<P>, CSSValue> };
const primitiveValues: PrimitiveValues = ObjectStream.of(Palettes)
    .mapEntryToValue((palette, steps) => {
        const values = generateRamp(rampConfigs[palette], steps.length);
        if (values.length !== steps.length)
            throw new Error(`Palette "${palette}" has ${steps.length} steps but its ramp generated ${values.length} colors.`);
        return createObjectFromEntries(steps.map((step, i) => [step, values[i]] as const));
    })
    .collect() as PrimitiveValues;
export default primitiveValues;
