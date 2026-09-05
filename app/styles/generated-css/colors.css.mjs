import {generateInterpolatedColorRules, generateTintsAndShadesRules} from "./color-css-generation-utils.ts";
import colorNames from "../theme/color-names.static.mjs";

const TINTS_SHADES_STEPS = 5;
const propertyNameFunctions = Object.fromEntries(
    Object
        .entries(colorNames)
        .map(([key, value]) => [key, i => value[i]])
);

const rules = {
    ...generateTintsAndShadesRules({
        baseColor: "var(--primary-color)",
        propertyNameFn: propertyNameFunctions.primary,
        mixStrength: 0.7,
        steps: TINTS_SHADES_STEPS
    }),
    ...generateTintsAndShadesRules({
        baseColor: "var(--secondary-color)",
        propertyNameFn: propertyNameFunctions.secondary,
        mixStrength: 0.7,
        steps: TINTS_SHADES_STEPS
    }),
    ...generateTintsAndShadesRules({
        baseColor: "var(--tertiary-color)",
        propertyNameFn: propertyNameFunctions.tertiary,
        mixStrength: 0.7,
        steps: TINTS_SHADES_STEPS
    }),
    ...generateTintsAndShadesRules({
        baseColor: "var(--secondary-neutral-color)",
        propertyNameFn: propertyNameFunctions.secondaryNeutral,
        mixStrength: 0.8,
        steps: TINTS_SHADES_STEPS,
        whiteColor: "oklch(1 0.05 var(--secondary-hue))",
        blackColor: "oklch(0 0.05 var(--secondary-hue))"
    }),
    ...generateInterpolatedColorRules({
        startColor: `var(--neutral-50)`,
        endColor: `var(--neutral-950)`,
        propertyNameFn: propertyNameFunctions.neutral,
        includeEnds: false
    })
};

// language=CSS
export default `@layer base {
    :root {
        ${Object.entries(rules).map(entry => entry.join(": ")).join(";\n")};
    }
}`;