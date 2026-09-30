import type {CSSPropertyRegistration} from "../../shared/types.ts";
import type {StandaloneValues} from "../../shared/standalones.ts";
import {colorProperties, type Seed} from "../custom-properties.ts";

// The brand's key color, as plain numbers for code that can't read CSS (icons, social cards).
export const SEED = {hue: 256, lightness: 0.56, chroma: 0.18} as const;

export function seedVar(seed: Seed) {
    return colorProperties.standaloneVar(seed);
}

const HUE: CSSPropertyRegistration = {syntax: "<number> | <angle>", inherits: true, initialValue: 0};
const FRACTION: CSSPropertyRegistration = {syntax: "<number> | <percentage>", inherits: true, initialValue: 0};

export const seeds = {
    "brand-1-hue": {value: SEED.hue, registration: HUE},
    "brand-2-hue": {value: `calc(${seedVar("brand-1-hue")} + 20)`, registration: HUE},
    "brand-3-hue": {value: `calc(${seedVar("brand-1-hue")} + 40)`, registration: HUE},
    "brand-lightness": {value: SEED.lightness, registration: FRACTION},
    "brand-chroma": {value: SEED.chroma, registration: FRACTION}
} satisfies StandaloneValues<Seed>;
