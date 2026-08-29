import {deviceBreakpoint} from "@/app/utils/css/device-query";
import {round} from "svg-path-kit/numbers";

function no_op(t: number) { return t; }
function generateColorMixRules(
    baseColor: string,
    mixColor: string,
    mixStrength: number,
    colorNameGenerator: (i: number) => string,
    easing: (t: number) => number = no_op,
    steps: number = 5
) {
    const rules: string[] = [];
    mixStrength = mixStrength * 100;
    for (let i = 0; i < steps; i++) {
        rules.push(`${colorNameGenerator(i)}: color-mix(in oklch, ${baseColor}, ${mixColor} ${round(easing((i + 1) / steps) * mixStrength, 4)}%)`);
    }
    return rules;
}

const TINT_TOKENS = [50, 100, 200, 300, 400].reverse();
const SHADE_TOKENS = [600, 700, 800, 900, 950];

function generateTintsAndShadesRules({baseColor, baseColorName, whiteColor = "white", blackColor = "black", mixStrength, easing = no_op}: {
    baseColor: string;
    baseColorName: string;
    whiteColor?: string;
    blackColor?: string;
    mixStrength: number | [number, number];
    easing?: ((t: number) => number) | [(t: number) => number, (t: number) => number];
}) {
    const tints = generateColorMixRules(baseColor, whiteColor, typeof mixStrength === "number" ? mixStrength : mixStrength[0], i => `--${baseColorName}-${TINT_TOKENS[i]}`).reverse();
    const shades = generateColorMixRules(baseColor, blackColor, typeof mixStrength === "number" ? mixStrength : mixStrength[1], i => `--${baseColorName}-${SHADE_TOKENS[i]}`);

    // language=CSS prefix=":root {" suffix="}"
    return `
        ${tints.join(";\n")};
        --${baseColorName}-500: ${baseColor};
        ${shades.join(";\n")};
    `;
}

// language=CSS
export default `@layer base {
    :root {
        ${generateTintsAndShadesRules({ baseColor: "var(--primary-color)", baseColorName: "primary", mixStrength: 0.7 })};
        ${generateTintsAndShadesRules({ baseColor: "var(--secondary-color)", baseColorName: "secondary", mixStrength: 0.7 })};
        ${generateTintsAndShadesRules({ baseColor: "var(--tertiary-color)", baseColorName: "tertiary", mixStrength: 0.7 })};
        ${generateTintsAndShadesRules({ baseColor: "var(--secondary-neutral-color)", baseColorName: "secondary-neutral", mixStrength: 0.8, whiteColor: "oklch(1 0.05 var(--secondary-hue))", blackColor: "oklch(0 0.05 var(--secondary-hue))" })};
    }
    :root {
        --mobile-s: ${deviceBreakpoint.mobileS}px;
        --mobile-m: ${deviceBreakpoint.mobileM}px;
        --mobile-l: ${deviceBreakpoint.mobileL}px;
        --tablet: ${deviceBreakpoint.tablet}px;
        --laptop: ${deviceBreakpoint.laptop}px;
        --laptop-l: ${deviceBreakpoint.laptopL}px;
        --desktop: ${deviceBreakpoint.desktop}px;
    }
}`;