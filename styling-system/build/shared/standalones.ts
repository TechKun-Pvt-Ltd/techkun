import type {CSSPropertyRegistration, CSSValue} from "./types.ts";

/* Standalones: not tokens and never mapped, so they sit outside the schema. Just values other values are
   computed from at runtime (seeds, scale ratios), declared next to the tokens. */

export type StandaloneValue = { value: CSSValue; registration?: CSSPropertyRegistration };
export type StandaloneValues<N extends string> = {
    [K in N]: StandaloneValue;
};
