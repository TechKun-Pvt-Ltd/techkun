import {round} from "svg-path-kit/numbers";
import type {GroupedPrimitiveValues, PrimitiveTokenVariant} from "./schema.ts";
import {type CSSPropertyOf, flattenPrimitiveValues} from "./schema.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSValue} from "../shared/types.ts";

/* Scale ratio — choose a musical interval:
   Minor Second:   1.067  (1 semitone)
   Major Second:   1.125  (2 semitones)
   Minor Third:    1.189  (3 semitones)
   Major Third:    1.260  (4 semitones) ← a good default for UI
   Perfect Fourth: 1.333  (5 semitones)
   Tritone:        1.414  (6 semitones)
   Perfect Fifth:  1.500  (7 semitones)
*/
const MIN_SCALE_RATIO = 1.125;
const MAX_SCALE_RATIO = 1.260;
// Inputs of the scale.
const BASE_LINE_HEIGHT = 1.6;
const BASE_LETTER_SPACING = 0.035;
const LS_OFFSET = 0.01;

// Size token -> power of the scale ratio its values derive from.
const TOKEN_TO_POWER: Record<PrimitiveTokenVariant<"type-size">, number> = {
    xs: -2,
    sm: -1,
    base: 0,
    lg: 1,
    xl: 2,
    "2xl": 3,
    "3xl": 4,
    "4xl": 5,
    "5xl": 6,
    "6xl": 7
};
function createCssTypeScale(): GroupedPrimitiveValues["type-size"] {
    const lhAddend = BASE_LINE_HEIGHT - 1;
    return ObjectStream.of(TOKEN_TO_POWER)
        .mapEntryToValue((variant, power): { [P in CSSPropertyOf<"type-size">]: CSSValue; } => {
            if (variant === "base")
                return {
                    "font-size": "1rem",
                    "line-height": BASE_LINE_HEIGHT,
                    "letter-spacing": `${BASE_LETTER_SPACING}em`
                };

            const scaleRatioInverse = Math.pow(MAX_SCALE_RATIO, -power);
            // language=CSS prefix="div { --var: " suffix="; }"
            const operand = power === 1 ? "var(--scale-ratio)" : `pow(var(--scale-ratio), ${power})`;

            // language=CSS prefix="div { --var: " suffix="; }"
            return {
                "font-size": `round(var(--font-size-base) * ${operand}, 1px)`,
                "line-height": round(1 + lhAddend * scaleRatioInverse, 1e-1),
                "letter-spacing": `${round((BASE_LETTER_SPACING + LS_OFFSET) * scaleRatioInverse - LS_OFFSET, 1e-4)}em`
            };
        })
        .collect() as GroupedPrimitiveValues["type-size"];
}

export const standaloneValues = {
    // language=CSS prefix="div { --var: " suffix="; }"
    scaleRatio: `calc(${MIN_SCALE_RATIO} + ${MAX_SCALE_RATIO - MIN_SCALE_RATIO} * var(--mobile-s-to-laptop-mid))`,
    letterSpacingOffset: `${LS_OFFSET}em`
};
const primitiveValuesGrouped: GroupedPrimitiveValues = {
    "type-size": createCssTypeScale(),
    weight: {
        regular: {"font-weight": 400},
        medium: {"font-weight": 500},
        semibold: {"font-weight": 600},
        bold: {"font-weight": 700}
    }
};
const primitiveValues = flattenPrimitiveValues(primitiveValuesGrouped);
export default primitiveValues;
