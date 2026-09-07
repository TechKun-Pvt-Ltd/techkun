import { PALETTE_ITEM_CONFIG, PALETTE_ITEM_KEYS } from "./palette-items.config";
import type { CustomizationState } from "./types";

/**
 * Produces the "no customization" state. Base/white/black overrides are
 * `null`, meaning "fall back to the CSS var / default the theme already
 * uses" — so this state renders identically to the page's own generated CSS.
 */
export function createDefaultCustomizationState(): CustomizationState {
    const state = {} as CustomizationState;

    for (const key of PALETTE_ITEM_KEYS) {
        const cfg = PALETTE_ITEM_CONFIG[key];
        state[key] =
            cfg.type === "shades-tints"
                ? {
                    type: "shades-tints",
                    baseColorOverride: null,
                    whiteColorOverride: null,
                    blackColorOverride: null,
                    mixStrength: cfg.defaultMixStrength,
                    easing: "linear",
                }
                : {
                    type: "interpolated",
                    easing: "linear",
                };
    }

    return state;
}