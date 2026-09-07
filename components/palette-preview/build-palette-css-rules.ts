import {
    generateInterpolatedColorRules,
    generateTintsAndShadesRules,
} from "@/app/styles/generated-css/color-css-generation-utils";
import { PALETTE_ITEM_CONFIG, PALETTE_ITEM_KEYS, getVarNames } from "./palette-items.config";
import { resolveEasing } from "./easing-options";
import type { CustomizationState } from "./types";
import {EasingFunction} from "times-fps";

export function buildPaletteCssRules(state: CustomizationState): Record<string, string> {
    let rules: Record<string, string> = {};

    for (const key of PALETTE_ITEM_KEYS) {
        const cfg = PALETTE_ITEM_CONFIG[key];
        const item = state[key];
        const varNames = getVarNames(key);
        const propertyNameFn = (i: number) => varNames[i];

        if (cfg.type === "shades-tints" && item.type === "shades-tints") {
            const easing = Array.isArray(item.easing)
                ? ([resolveEasing(item.easing[0]), resolveEasing(item.easing[1])] as [EasingFunction, EasingFunction])
                : resolveEasing(item.easing);

            rules = {
                ...rules,
                ...generateTintsAndShadesRules({
                    baseColor: item.baseColorOverride ?? cfg.baseColorVar,
                    propertyNameFn,
                    whiteColor: item.whiteColorOverride ?? cfg.defaultWhiteColor,
                    blackColor: item.blackColorOverride ?? cfg.defaultBlackColor,
                    mixStrength: item.mixStrength,
                    easing,
                    steps: cfg.steps,
                }),
            };
        } else if (cfg.type === "interpolated" && item.type === "interpolated") {
            rules = {
                ...rules,
                ...generateInterpolatedColorRules({
                    startColor: cfg.startColorVar,
                    endColor: cfg.endColorVar,
                    propertyNameFn,
                    steps: cfg.steps,
                    easing: resolveEasing(item.easing),
                    includeEnds: cfg.includeEnds,
                }),
            };
        }
    }

    return rules;
}