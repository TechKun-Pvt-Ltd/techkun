export type PaletteItemKey =
    | "primary"
    | "secondary"
    | "tertiary"
    | "secondaryNeutral"
    | "neutral";

export type EasingKey = string;

export interface ShadesTintsCustomization {
    type: "shades-tints";
    baseColorOverride: string | null;
    whiteColorOverride: string | null;
    blackColorOverride: string | null;
    // number | [tint, shade] — plain number means "linked", tuple means "split"
    mixStrength: number | [number, number];
    easing: EasingKey | [EasingKey, EasingKey];
}

export interface InterpolatedCustomization {
    type: "interpolated";
    easing: EasingKey;
}

export type PaletteCustomization =
    | ShadesTintsCustomization
    | InterpolatedCustomization;

export type CustomizationState = Record<PaletteItemKey, PaletteCustomization>;