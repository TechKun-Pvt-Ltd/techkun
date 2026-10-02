import {ColorCSSEmitter, ColorTokenStore, type FlatSchema, type Theme} from "./system.ts";
import type {ModifierStrategy} from "../shared/emitter.ts";
import {rule} from "../shared/css.ts";
import type {CSSValue} from "../shared/types.ts";
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

// Each token's theme values are combined into one `light-dark()` value on the root rule; the root's color-scheme
// picks between them. A theme without a value of its own takes the default. A single value is declared as it is.
const themeValues = {
    combine: values => {
        const byTheme = new Map<string | undefined, CSSValue>();
        for (const {modifiers, value} of values) {
            const theme = modifiers?.theme;
            if (byTheme.has(theme)) throw new Error(`More than one color value for ${theme === undefined ? "the default" : `the ${theme} theme`}.`);
            byTheme.set(theme, value);
        }
        const light = byTheme.get("light") ?? byTheme.get(undefined);
        const dark = byTheme.get("dark") ?? byTheme.get(undefined);
        if (light !== undefined && dark !== undefined && light !== dark) return [{value: `light-dark(${light}, ${dark})`}];
        const value = light ?? dark;
        return value === undefined ? [] : [{value}];
    },
    rules: () => {
        throw new Error("Every color value is combined into a default; no condition is left for a rule.");
    },
    rootDeclarations: () => ({"color-scheme": colorSchema.shape.modifiers.theme.map(theme => colorSchemes[theme]).join(" ")})
} satisfies ModifierStrategy<FlatSchema>;

export const colorEmitter = new ColorCSSEmitter(colorProperties, colorTokens, colorNaming, themeRules);

export {SEED} from "./content/seeds.ts";
