import {round} from "svg-path-kit/numbers";

function generateColorMixRules(
    baseColor,
    mixColor,
    propertyNameGenerator,
    stepGenerator,
    steps = 5
) {
    const rules = [];

    for (let i = 0; i < steps; i++) {
        rules.push(
            `${propertyNameGenerator(i)}: color-mix(in oklch, ${baseColor}, ${mixColor} ${round(stepGenerator(i, steps) * 100, 4)}%)`
        );
    }

    return rules;
}

function no_op(t) { return t; }
const TINT_TOKENS = [50, 100, 200, 300, 400];
const SHADE_TOKENS = [600, 700, 800, 900, 950];

function generateTintsAndShadesRules({
    baseColor,
    baseColorName,
    whiteColor = "white",
    blackColor = "black",
    mixStrength,
    easing = no_op
}) {
    const tintsMixStrength =
        typeof mixStrength === "number" ? mixStrength : mixStrength[0];

    const tintsEasing =
        typeof easing === "function" ? easing : easing[0];

    const shadesMixStrength =
        typeof mixStrength === "number" ? mixStrength : mixStrength[1];

    const shadesEasing =
        typeof easing === "function" ? easing : easing[1];

    const tints = generateColorMixRules(
        baseColor,
        whiteColor,
        i => `--${baseColorName}-${TINT_TOKENS[i]}`,
        (i, total) => tintsEasing(1 - i / total) * tintsMixStrength
    );

    const shades = generateColorMixRules(
        baseColor,
        blackColor,
        i => `--${baseColorName}-${SHADE_TOKENS[i]}`,
        (i, total) => shadesEasing((i + 1) / total) * shadesMixStrength
    );

    // language=CSS prefix=":root {" suffix="}"
    return `
        ${tints.join(";\n")};
        --${baseColorName}-500: ${baseColor};
        ${shades.join(";\n")};
    `;
}

// language=CSS
export default `
@layer base {
    :root {
        ${generateTintsAndShadesRules({
            baseColor: "var(--primary-color)",
            baseColorName: "primary",
            mixStrength: 0.7
        })};
        ${generateTintsAndShadesRules({
            baseColor: "var(--secondary-color)",
            baseColorName: "secondary",
            mixStrength: 0.7
        })};
        ${generateTintsAndShadesRules({
            baseColor: "var(--tertiary-color)",
            baseColorName: "tertiary",
            mixStrength: 0.7
        })};
        ${generateTintsAndShadesRules({
            baseColor: "var(--secondary-neutral-color)",
            baseColorName: "secondary-neutral",
            mixStrength: 0.8,
            whiteColor: "oklch(1 0.05 var(--secondary-hue))",
            blackColor: "oklch(0 0.05 var(--secondary-hue))"
        })};
    }
}
`;