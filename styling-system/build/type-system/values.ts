import {round} from "svg-path-kit/numbers";
import type {PrimitiveValues} from "./types.ts";
import type {TypeSizeToken} from "./schema.ts";

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
const TOKEN_TO_POWER: Record<TypeSizeToken, number> = {
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
function createCssTypeScale() {
    const values = Object.fromEntries(Object.keys(TOKEN_TO_POWER).map(token => [token, {}])) as PrimitiveValues["typeSize"];
    const lhAddend = BASE_LINE_HEIGHT - 1;
    for (const [token, power] of Object.entries(TOKEN_TO_POWER) as [TypeSizeToken, number][]) {
        const tokenValues = values[token];
        if (token === "base") {
            tokenValues["font-size"] = "1rem";
            tokenValues["line-height"] = BASE_LINE_HEIGHT;
            tokenValues["letter-spacing"] = `${BASE_LETTER_SPACING}em`;
            continue;
        }

        // language=CSS prefix="div { --var: " suffix="; }"
        const operand = power === 1 ? "var(--scale-ratio)" : `pow(var(--scale-ratio), ${Math.abs(power)})`;
        // language=CSS prefix="div { --var: " suffix="; }"
        tokenValues["font-size"] = `round(var(--font-size-base) ${(power < 0 ? "/" : "*")} ${operand}, 1px)`;

        const scaleRatioInverse = Math.pow(MAX_SCALE_RATIO, -power);
        tokenValues["line-height"] = round(1 + lhAddend * scaleRatioInverse, 1);
        tokenValues["letter-spacing"] = `${round((BASE_LETTER_SPACING + LS_OFFSET) * scaleRatioInverse - LS_OFFSET, 4)}em`;
    }
    return values;
}

export const standaloneValues = {
    // language=CSS prefix="div { --var: " suffix="; }"
    scaleRatio: `calc(${MIN_SCALE_RATIO} + ${MAX_SCALE_RATIO - MIN_SCALE_RATIO} * var(--mobile-s-to-laptop-mid))`,
    letterSpacingOffset: `${LS_OFFSET}em`
};
const primitiveValues: PrimitiveValues = {
    typeSize: createCssTypeScale(),
    weight: {
        regular: {"font-weight": 400},
        medium: {"font-weight": 500},
        semibold: {"font-weight": 600},
        bold: {"font-weight": 700}
    }
};
export default primitiveValues;