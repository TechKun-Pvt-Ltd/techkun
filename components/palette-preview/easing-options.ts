import {cubicBezierEasing, EasingFunction} from "times-fps";
import * as easings from "./easing-functions";
import {BezierDefinition} from "motion/react";

export interface EasingOption {
    value: string;
    label: string;
    fn: EasingFunction;
}

const FAMILIES: [string, string][] = [
    ["sine", "Sine"],
    ["quad", "Quad"],
    ["cubic", "Cubic"],
    ["quart", "Quart"],
    ["quint", "Quint"],
    ["expo", "Expo"],
    ["circ", "Circ"],
    ["back", "Back"],
    ["elastic", "Elastic"],
    ["bounce", "Bounce"],
];

const VARIANTS: [string, string][] = [
    ["In", "In"],
    ["Out", "Out"],
    ["InOut", "In-Out"],
];

export const EASING_OPTIONS: EasingOption[] = [
    { value: "linear", label: "Linear", fn: easings.linear },
    ...FAMILIES.flatMap(([familyKey, familyLabel]) =>
        VARIANTS.map(([variantKey, variantLabel]) => {
            const key = `${familyKey}${variantKey}` as keyof typeof easings;
            return {
                value: key,
                label: `${familyLabel} ${variantLabel}`,
                fn: easings[key] as EasingFunction,
            };
        })
    ),
];

export const EASING_FN_MAP: Record<string, EasingFunction> = Object.fromEntries(
    EASING_OPTIONS.map((opt) => [opt.value, opt.fn])
);

export function resolveEasing(key: BezierDefinition): EasingFunction {
    return cubicBezierEasing(key[0], key[1], key[2], key[3]);
}