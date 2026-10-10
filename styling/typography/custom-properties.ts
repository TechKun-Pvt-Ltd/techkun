import {CompositeCustomProperties} from "../../styling-system/shared/composite-tokens/custom-properties.ts";
import {typeSchema} from "./spec.ts";
import {typeNaming} from "./naming.ts";

// Standalones: not tokens, just the values the type scale is computed from at runtime.
export const STANDALONES = ["scale-ratio", "ls-offset"] as const;
export type Standalone = typeof STANDALONES[number];

export const typeProperties = new CompositeCustomProperties(typeSchema, STANDALONES, typeNaming);
