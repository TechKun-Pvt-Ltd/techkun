import {round} from "svg-path-kit/numbers";

class CssColorRulesArray extends Array {
    toString() {
        return this.join(";\n");
    }
    valueOf() {
        return this.toString();
    }
    [Symbol.toPrimitive]() {
        return this.toString();
    }
}

function generateColorMixRules(
    baseColor,
    mixColor,
    propertyNameFn,
    stepGenerator,
    total = 5
) {
    const rules = new CssColorRulesArray();

    for (let i = 0; i < total; i++) {
        rules.push(
            `${propertyNameFn(i, total)}: color-mix(in oklch, ${baseColor}, ${mixColor} ${round(stepGenerator(i, total) * 100, 4)}%)`
        );
    }

    return rules;
}

function no_op(t) { return t; }
const NUMERIC_TOKENS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function generateTintsAndShadesRules({
    baseColor,
    colorTitle,
    whiteColor = "white",
    blackColor = "black",
    mixStrength,
    easing = no_op
}) {
    function propertyNameFn(i) {
        return `--${colorTitle}-${NUMERIC_TOKENS[i]}`;
    }
    const tintsMixStrength =
        typeof mixStrength === "number" ? mixStrength : mixStrength[0];

    const tintsEasing =
        typeof easing === "function" ? easing : easing[0];

    const shadesMixStrength =
        typeof mixStrength === "number" ? mixStrength : mixStrength[1];

    const shadesEasing =
        typeof easing === "function" ? easing : easing[1];

    const TOTAL = 11;
    const CENTER_INDEX = (TOTAL - 1) * 0.5;
    const TINTS_COUNT = CENTER_INDEX;
    const SHADES_COUNT = TINTS_COUNT;

    const tints = generateColorMixRules(
        baseColor,
        whiteColor,
        propertyNameFn,
        (i, total) => tintsEasing(1 - i / total) * tintsMixStrength,
        TINTS_COUNT
    );

    const shades = generateColorMixRules(
        baseColor,
        blackColor,
        (i, total) => propertyNameFn(TINTS_COUNT + 1 + i, total),
        (i, total) => shadesEasing((i + 1) / total) * shadesMixStrength,
        SHADES_COUNT
    );

    return new CssColorRulesArray(...tints, `${propertyNameFn(CENTER_INDEX, TOTAL)}: ${baseColor}`, ...shades);
}

function generateInterpolatedColorRules({
    startColor, endColor,
    propertyNameFn,
    steps = 10, easing = no_op,
    includeEnds = true
}) {
    const rules = new CssColorRulesArray();
    if (includeEnds)
        rules.push(`${propertyNameFn(0, steps)}: ${startColor}`);

    for (let i = 1; i < steps; i++) {
        rules.push(
            `${propertyNameFn(i, steps)}: color-mix(in oklch, ${startColor}, ${endColor} ${round(easing(i / steps) * 100, 4)}%)`
        );
    }

    if (includeEnds)
        rules.push(`${propertyNameFn(steps, steps)}: ${endColor}`);

    return rules;
}

// language=CSS
export default `
@layer base {
    :root {
        ${generateTintsAndShadesRules({
            baseColor: "var(--primary-color)",
            colorTitle: "primary",
            mixStrength: 0.7
        })};
        ${generateTintsAndShadesRules({
            baseColor: "var(--secondary-color)",
            colorTitle: "secondary",
            mixStrength: 0.7
        })};
        ${generateTintsAndShadesRules({
            baseColor: "var(--tertiary-color)",
            colorTitle: "tertiary",
            mixStrength: 0.7
        })};
        ${generateTintsAndShadesRules({
            baseColor: "var(--secondary-neutral-color)",
            colorTitle: "secondary-neutral",
            mixStrength: 0.8,
            whiteColor: "oklch(1 0.05 var(--secondary-hue))",
            blackColor: "oklch(0 0.05 var(--secondary-hue))"
        })};
        ${generateInterpolatedColorRules({
            startColor: `var(--neutral-50)`,
            endColor: `var(--neutral-950)`,
            propertyNameFn(i) {
                return `--neutral-${NUMERIC_TOKENS[i]}`
            },
            includeEnds: false
        })};
    }
}
`;