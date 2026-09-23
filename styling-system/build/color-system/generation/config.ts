import type {EasingFunction} from "times-fps";

/* What a ramp is generated from. Every color is a CSS expression (it may reference seed custom properties),
   since ramps are mixed by the browser, not here. */

export type PerSide<T> = T | { tints: T; shades: T };

// Base color in the middle, tinted towards white above it and shaded towards black below it.
export type TintsShadesConfig = {
    type: "tints-shades";
    baseColor: string;
    mixStrength: PerSide<number>;
    easing?: PerSide<EasingFunction>;
    // How many steps come before the base color. Defaults to an even split; shades take the rest.
    tints?: number;
    whiteOverride?: string;
    blackOverride?: string;
};

// A straight interpolation from the first step's color to the last one's.
export type BlendConfig = {
    type: "blend";
    startColor: string;
    endColor: string;
    easing?: EasingFunction;
};

export type RampGenerationConfig = TintsShadesConfig | BlendConfig;
