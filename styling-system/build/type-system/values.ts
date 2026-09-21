import type {FontVariantToken, PrimitiveValues} from "./config.ts";
import {round} from "svg-path-kit/numbers";

/* Scale ratio — choose a musical interval:
   Minor Second:   1.067  (2 semitones)
   Major Second:   1.125  (2 semitones × semitone)
   Minor Third:    1.189
   Major Third:    1.260  ← a good default for UI
   Perfect Fourth: 1.333
   Tritone:        1.414
   Perfect Fifth:  1.500
*/
const MIN_SCALE_RATIO = 1.125;
const MAX_SCALE_RATIO = 1.260;
// language=CSS prefix="div { --var: " suffix="; }"
export const SCALE_RATIO = `calc(${MIN_SCALE_RATIO} + ${MAX_SCALE_RATIO - MIN_SCALE_RATIO} * var(--mobile-s-to-laptop-mid))`;

// Inputs of the scale. `--base-font-size` is the remaining one and lives in base/typography.css.
const BASE_LINE_HEIGHT = 1.6;
const BASE_LETTER_SPACING = 0.035;
export const LS_OFFSET = 0.01;

// Size token -> power of the scale ratio its values derive from.
const TOKEN_TO_POWER: Record<FontVariantToken, number> = {
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
    const values = Object.fromEntries(Object.keys(TOKEN_TO_POWER).map(token => [token, {}])) as PrimitiveValues["fontVariant"];
    const lhAddend = BASE_LINE_HEIGHT - 1;
    for (const [token, power] of Object.entries(TOKEN_TO_POWER) as [FontVariantToken, number][]) {
        const tokenValues = values[token];
        if (token === "base") {
            // The scale's inputs. Font size has no base value: `--base-font-size` lives in base/typography.css.
            tokenValues["line-height"] = BASE_LINE_HEIGHT;
            tokenValues["letter-spacing"] = `${BASE_LETTER_SPACING}em`;
            continue;
        }

        const operation = power < 0 ? "/" : "*";
        const operand = power === 1 ? "var(--scale-ratio)" : `pow(var(--scale-ratio), ${Math.abs(power)})`;
        const scaleRatioInverse = Math.pow(MAX_SCALE_RATIO, -power);

        // language=CSS prefix="div { --var: " suffix="; }"
        tokenValues["font-size"] = `round(var(--base-font-size) ${operation} ${operand}, 1px)`;
        tokenValues["line-height"] = round(1 + lhAddend * scaleRatioInverse, 1);
        tokenValues["letter-spacing"] = `${round((BASE_LETTER_SPACING + LS_OFFSET) * scaleRatioInverse - LS_OFFSET, 4)}em`;
    }
    return values;
}

const primitiveValues: PrimitiveValues = {
    fontVariant: createCssTypeScale(),
    fontWeight: {
        regular: {"font-weight": 400},
        medium: {"font-weight": 500},
        semibold: {"font-weight": 600},
        bold: {"font-weight": 700}
    }
};
export default primitiveValues;