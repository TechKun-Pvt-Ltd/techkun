import type {Theme, SemanticMappingTokenRef, ComponentMappingTokenRef} from "./schema.ts";
import primitiveValues, {seedValues} from "./primitive-values.ts";
import {componentMapping, semanticMapping} from "./mapping.ts";
import {cssCustomProperties} from "./css-custom-properties.ts";
import type {CSSPropertyRegistration, CSSCustomProperty, CSSCustomPropertyDeclarations, CSSValue} from "../shared/types.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import {getTokenRefResolver} from "../shared/simple-tokens/schema-shape.ts";
import {mergeAll} from "../shared/utils.ts";

/* Declarations: pair each token's custom property with its value. Primitive values are the generated ones;
   semantic and component values are var() references to whatever token their mapping points at. Seeds
   aren't tokens, so their CSS names are paired with them here directly. Registered, so they stay typed
   (and animatable) numbers. */

const resolveTokenRefBase = getTokenRefResolver(cssCustomProperties);

const HUE: CSSPropertyRegistration = {syntax: "<number> | <angle>", inherits: true, initialValue: 0};
const FRACTION: CSSPropertyRegistration = {syntax: "<number> | <percentage>", inherits: true, initialValue: 0};
const seedCssProperties = {
    "--color-brand-1-hue": {value: seedValues.brand1Hue, registration: HUE},
    "--color-brand-2-hue": {value: seedValues.brand2Hue, registration: HUE},
    "--color-brand-3-hue": {value: seedValues.brand3Hue, registration: HUE},
    "--color-brand-lightness": {value: seedValues.brandLightness, registration: FRACTION},
    "--color-brand-chroma": {value: seedValues.brandChroma, registration: FRACTION}
} satisfies { [K in CSSCustomProperty]: { value: CSSValue; registration: CSSPropertyRegistration } };

// Themes: where each theme's semantic tokens are declared, and the color-scheme declared with them.
const themes = {
    dark: {selector: ":root", colorScheme: "dark"}
} as const satisfies { [T in Theme]: { selector: string; colorScheme: string } };

const seedCssDeclarations: CSSCustomPropertyDeclarations = ObjectStream.of(seedCssProperties)
    .mapValues(({value}) => value)
    .collect();
const seedCssRegistrations: Record<CSSCustomProperty, CSSPropertyRegistration> = ObjectStream.of(seedCssProperties)
    .mapValues(({registration}) => registration)
    .collect();

function resolveTokenRef({ref, alpha}: SemanticMappingTokenRef | ComponentMappingTokenRef): CSSValue {
    const value = resolveTokenRefBase(ref);
    return alpha === undefined ? value : `oklch(from ${value} l c h / ${alpha})`;
}

const primitiveCssDeclarations: CSSCustomPropertyDeclarations = ObjectStream.of(primitiveValues)
    .mapKeys(token => cssCustomProperties[token])
    .collect();

const themeCssDeclarations = ObjectStream.of(themes)
    .mapEntryToValue((_, spec) => ({
        ...spec,
        declarations: ObjectStream.of(semanticMapping)
            .mapEntries((token, ref) => [cssCustomProperties[token], resolveTokenRef(ref)])
            .collect() as CSSCustomPropertyDeclarations
    }))
    .collect();

const componentCssDeclarations: CSSCustomPropertyDeclarations = ObjectStream.of(componentMapping)
    .mapEntries((token, ref) => [cssCustomProperties[token], resolveTokenRef(ref)])
    .collect();

export const themeDeclarations = themeCssDeclarations;
export const declarations = mergeAll([seedCssDeclarations, primitiveCssDeclarations, componentCssDeclarations]);
export const customPropertyRegistrations = seedCssRegistrations;