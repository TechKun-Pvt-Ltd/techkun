import type {Theme} from "../schema/lookups.ts";

// Themes: where each theme's semantic tokens are declared, and the color-scheme declared with them.
export type ThemePresentation = { selector: string; colorScheme: string };

export const themes = {
    dark: {selector: ":root", colorScheme: "dark"}
} as const satisfies { [T in Theme]: ThemePresentation };
