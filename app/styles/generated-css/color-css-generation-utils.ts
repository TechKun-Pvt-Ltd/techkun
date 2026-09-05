import {round} from "svg-path-kit/numbers";
import type {EasingFunction} from "times-fps";

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
        rules[`${propertyNameFn(i, total)}`] = `color-mix(in oklch, ${baseColor}, ${mixColor} ${round(stepGenerator(i, total) * 100, 4)}%)`;
    }

    return rules;
}

function no_op(t: number) { return t; }

export function generateTintsAndShadesRules(
    {
        baseColor,
        propertyNameFn,
        whiteColor = "white",
        blackColor = "black",
        mixStrength,
        easing = no_op,
        steps = 5
    }: {
        baseColor: string;
        propertyNameFn: PropertyNameFn;
        whiteColor: string;
        blackColor: string;
        mixStrength: number | [number, number];
        easing?: EasingFunction | [EasingFunction, EasingFunction];
        steps?: number | [number, number];
    }
): ColorCssRules {
    const tintsMixStrength =
        typeof mixStrength === "number" ? mixStrength : mixStrength[0];

    const tintsEasing =
        typeof easing === "function" ? easing : easing[0];

    const shadesMixStrength =
        typeof mixStrength === "number" ? mixStrength : mixStrength[1];

    const shadesEasing =
        typeof easing === "function" ? easing : easing[1];

    const TINTS_COUNT = typeof steps === "number" ? steps : steps[0];
    const SHADES_COUNT = typeof steps === "number" ? steps : steps[1];

    const TOTAL = (typeof steps === "number" ? 2 * steps : steps[0] + steps[1]) + 1;
    const CENTER_INDEX = TINTS_COUNT;

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

    return {
        ...tints,
        [`${propertyNameFn(CENTER_INDEX, TOTAL)}`]: baseColor,
        ...shades
    };
}

export function generateInterpolatedColorRules(
    {
        startColor, endColor,
        propertyNameFn,
        steps = 10, easing = no_op,
        includeEnds = true
    }: {
        startColor: string;
        endColor: string;
        propertyNameFn: PropertyNameFn;
        steps?: number;
        easing?: EasingFunction;
        includeEnds?: boolean;
    }
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