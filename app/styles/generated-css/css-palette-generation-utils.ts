import {round} from "svg-path-kit/numbers";
import {
    type GenericColorRampGenerationConfig, ColorRampType,
    type PaletteGenerationConfig,
    type TintsShadesGenerationConfig
} from "./css-palette-generation-config.ts";
import colorRampsStatic from "../theme/color-ramps.static.mjs";

type ColorCssRules = { [key: string]: string };
export type PropertyNameFn = (i: number, total: number) => string;

export function generateColorMixRules(
    baseColor: string,
    mixColor: string,
    propertyNameFn: PropertyNameFn,
    stepGenerator: (i: number, total: number) => number,
    total = 5
) {
    const rules: ColorCssRules = {};

    for (let i = 0; i < total; i++) {
        const step = stepGenerator(i, total);
        rules[`${propertyNameFn(i, total)}`] = `color-mix(in oklch, ${baseColor}, ${mixColor} ${round((step < 0 ? 0 : step) * 100, 4)}%)`;
    }

    return rules;
}

function no_op(t: number) { return t; }

interface TintsShadesRulesGenerationConfig extends TintsShadesGenerationConfig {
    propertyNameFn: PropertyNameFn;
}

export function generateTintsAndShadesRules(
    {
        baseColor,
        propertyNameFn,
        mixStrength,
        easing = no_op,
        steps = 5,
        whiteOverride,
        blackOverride
    }: TintsShadesRulesGenerationConfig
): ColorCssRules {
    const tintsMixStrength =
        typeof mixStrength === "number" ? mixStrength : mixStrength.tints;

    const tintsEasing = typeof easing === "function" ? easing : easing.tints;

    const shadesMixStrength =
        typeof mixStrength === "number" ? mixStrength : mixStrength.shades;

    const shadesEasing = typeof easing === "function" ? easing : easing.shades;

    const TINTS_COUNT = typeof steps === "number" ? steps : steps.tints;
    const SHADES_COUNT = typeof steps === "number" ? steps : steps.shades;

    const TOTAL = (typeof steps === "number" ? 2 * steps : steps.tints + steps.shades) + 1;
    const CENTER_INDEX = TINTS_COUNT;

    const tints = generateColorMixRules(
        baseColor,
        whiteOverride ?? "white",
        propertyNameFn,
        (i, total) => tintsEasing(1 - i / total) * tintsMixStrength,
        TINTS_COUNT
    );

    const shades = generateColorMixRules(
        baseColor,
        blackOverride ?? "black",
        (i, total) => propertyNameFn(TINTS_COUNT + 1 + i, total),
        (i, total) => shadesEasing((i + 1) / total) * shadesMixStrength,
        SHADES_COUNT
    );

    return {
        ...tints,
        [`${propertyNameFn(CENTER_INDEX, TOTAL)}`]: baseColor,
        ...shades
    };
}

interface ColorBlendRulesGenerationConfig extends GenericColorRampGenerationConfig {
    propertyNameFn: PropertyNameFn;
    includeEnds?: boolean;
}

export function generateColorBlendRules(
    {
        startColor, endColor,
        propertyNameFn,
        steps = 10, easing = no_op,
        includeEnds = true
    }: ColorBlendRulesGenerationConfig
) {
    const rules: ColorCssRules = {};
    if (includeEnds)
        rules[`${propertyNameFn(0, steps)}`] = startColor;

    for (let i = 1; i < steps; i++) {
        rules[`${propertyNameFn(i, steps)}`] = `color-mix(in oklch, ${startColor}, ${endColor} ${round(easing(i / steps) * 100, 4)}%)`;
    }

    if (includeEnds)
        rules[`${propertyNameFn(steps, steps)}`] = endColor;

    return rules;
}

const propertyNameFunctions = Object.fromEntries(
    (Object.entries(colorRampsStatic) as [string, string[]][])
        .map(([key, value]): [string, PropertyNameFn] => [key, i => value[i]])
);

export function processConfig(config: PaletteGenerationConfig) {
    let rules: ColorCssRules = {};
    for (const [key, value] of Object.entries(config)) {
        rules = {
            ...rules,
            ...(value.type === ColorRampType.TINTS_SHADES ?
                generateTintsAndShadesRules({...value, propertyNameFn: propertyNameFunctions[key]}) :
                generateColorBlendRules({...value, propertyNameFn: propertyNameFunctions[key], includeEnds: false}))
        };
    }
    return rules;
}