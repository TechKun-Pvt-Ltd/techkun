import {ColorCSSEmitter, ColorTokenStore, type FlatSchema, type Theme} from "./system.ts";
import type {ModifierStrategy} from "../shared/emitter.ts";
import {rule} from "../shared/css.ts";
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

// Each theme's values are declared in a rule of their own, under the theme's selector.
const themeRules = {
    combine: values => values,
    rules: ({theme}, declarations) => {
        if (theme === undefined) throw new Error("A color condition always names a theme.");
        return [rule(colorNaming.themeSelector(theme), {"color-scheme": colorSchemes[theme], ...declarations})];
    }
} satisfies ModifierStrategy<FlatSchema>;

export const colorEmitter = new ColorCSSEmitter(colorProperties, colorTokens, colorNaming, themeRules);

export {SEED} from "./content/seeds.ts";
