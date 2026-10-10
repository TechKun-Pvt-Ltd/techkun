import {round} from "svg-path-kit/numbers";
import type {CSSPropertyOf, PrimitiveTokenVariant, PrimitiveValues} from "../spec.ts";
import {typeProperties} from "../custom-properties.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSValue} from "../../../styling-system/shared/types.ts";
import {LS_OFFSET, MAX_SCALE_RATIO, standaloneVar} from "./standalones.ts";

// Inputs of the scale.
const BASE_LINE_HEIGHT = 1.6;
const BASE_LETTER_SPACING = 0.035;

// Size variant -> power of the scale ratio its values derive from.
const VARIANT_TO_POWER: Record<PrimitiveTokenVariant<"type-size">, number> = {
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
function createCssTypeScale(): PrimitiveValues["type-size"] {
    const lhAddend = BASE_LINE_HEIGHT - 1;
    return ObjectStream.of(VARIANT_TO_POWER)
        .mapEntryToValue((variant, power): { [P in CSSPropertyOf<"type-size">]: CSSValue; } => {
            if (variant === "base")
                return {
                    "font-size": "1rem",
                    "line-height": BASE_LINE_HEIGHT,
                    "letter-spacing": `${BASE_LETTER_SPACING}em`
                };

            const scaleRatioInverse = Math.pow(MAX_SCALE_RATIO, -power);
            // language=CSS prefix="div { --var: " suffix="; }"
            const operand = power === 1 ? standaloneVar("scale-ratio") : `pow(${standaloneVar("scale-ratio")}, ${power})`;

            // language=CSS prefix="div { --var: " suffix="; }"
            return {
                "font-size": `round(${typeProperties.primitiveVars("type-size", "base")["font-size"]} * ${operand}, 1px)`,
                "line-height": round(1 + lhAddend * scaleRatioInverse, 1e-1),
                "letter-spacing": `${round((BASE_LETTER_SPACING + LS_OFFSET) * scaleRatioInverse - LS_OFFSET, 1e-4)}em`
            };
        })
        .collect() as PrimitiveValues["type-size"];
}

const primitiveValues: PrimitiveValues = {
    "type-size": createCssTypeScale(),
    weight: {
        regular: {"font-weight": 400},
        medium: {"font-weight": 500},
        semibold: {"font-weight": 600},
        bold: {"font-weight": 700}
    }
};
export default primitiveValues;
