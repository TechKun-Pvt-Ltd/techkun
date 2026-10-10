import {SimpleCustomProperties} from "../../styling-system/shared/simple-tokens/custom-properties.ts";
import {colorSchema} from "./spec.ts";
import {colorNaming} from "./naming.ts";

// Seeds: not tokens and not part of the palette, just the standalone values the ramps are mixed from.
export const SEEDS = ["brand-1-hue", "brand-2-hue", "brand-3-hue", "brand-lightness", "brand-chroma"] as const;
export type Seed = typeof SEEDS[number];

export const colorProperties = new SimpleCustomProperties(colorSchema, SEEDS, colorNaming);
