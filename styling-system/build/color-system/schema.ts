// Palettes: each one is a ramp of steps (the names a mapping can pick from), lightest first.
import type {Palette, PaletteToken} from "./types.ts";

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

export const Palettes = {
    "brand-1": STEPS,
    "brand-2": STEPS,
    "brand-3": STEPS,
    neutral: STEPS,
    "neutral-tinted": STEPS
} as const satisfies { [palette: string]: readonly string[] };

export const PaletteTokens: PaletteToken[] = (Object.keys(Palettes) as Palette[])
    .flatMap(palette => Palettes[palette].map(step => `${palette}-${step}` as const));

// Categories: what a semantic or component token colors, and the CSS property its utility sets.
// null declares the token's custom property but generates no utility for it.
export const Categories = {
    bg: "background-color",
    text: "color",
    border: "border-color",
    fill: "fill",
    stroke: "stroke",
    brand: null
} as const satisfies { [category: string]: string | null };

// Themes: where each theme's semantic tokens are declared, and the color-scheme it declares with them.
export const Themes = {
    dark: {selector: ":root", colorScheme: "dark"}
} as const satisfies { [theme: string]: { selector: string; colorScheme: string } };
