import {ColorCSSEmitter, ColorTokenStore, type Theme} from "./system.ts";
import {colorSchema} from "./spec.ts";
import {colorProperties, SEEDS} from "./custom-properties.ts";
import {colorNaming} from "./naming.ts";
import {seeds} from "./content/seeds.ts";
import primitiveValues from "./content/primitives.ts";
import {componentMapping, semanticMapping} from "./content/mapping.ts";

const colorTokens = new ColorTokenStore(colorSchema, SEEDS, {
    seeds,
    primitive: primitiveValues,
    semantic: semanticMapping,
    component: componentMapping
});

// The color-scheme declared with each theme's semantic tokens.
const colorSchemes = {
    dark: "dark"
} as const satisfies { [T in Theme]: string };

export const colorEmitter = new ColorCSSEmitter(colorProperties, colorTokens, colorNaming, {
    contextDeclarations: ({theme}) => ({"color-scheme": colorSchemes[theme]})
});

export {SEED} from "./content/seeds.ts";
