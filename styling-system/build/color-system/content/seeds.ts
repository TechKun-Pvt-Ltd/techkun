import {seedProperty} from "../naming.ts";
import type {CSSPropertyRegistration, CSSValue} from "../../shared/types.ts";
import {toVarRef} from "../../shared/utils.ts";

// The brand's key color, as plain numbers for code that can't read CSS (icons, social cards).
export const SEED = {hue: 256, lightness: 0.56, chroma: 0.18} as const;

/* Seeds: not tokens and not part of the palette, just the standalone values the ramps are mixed from. */

const SEEDS = ["brand-1-hue", "brand-2-hue", "brand-3-hue", "brand-lightness", "brand-chroma"] as const;
export type Seed = typeof SEEDS[number];

export function seedVar(seed: Seed): CSSValue {
    return toVarRef(seedProperty(seed));
}

const HUE: CSSPropertyRegistration = {syntax: "<number> | <angle>", inherits: true, initialValue: 0};
const FRACTION: CSSPropertyRegistration = {syntax: "<number> | <percentage>", inherits: true, initialValue: 0};

export const seeds = {
    "brand-1-hue": {value: SEED.hue, registration: HUE},
    "brand-2-hue": {value: `calc(${seedVar("brand-1-hue")} + 20)`, registration: HUE},
    "brand-3-hue": {value: `calc(${seedVar("brand-1-hue")} + 40)`, registration: HUE},
    "brand-lightness": {value: SEED.lightness, registration: FRACTION},
    "brand-chroma": {value: SEED.chroma, registration: FRACTION}
} satisfies { [S in Seed]: { value: CSSValue; registration: CSSPropertyRegistration } };
