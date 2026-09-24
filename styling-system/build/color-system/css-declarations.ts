import type {Theme, TokenRef} from "./schema.ts";
import primitiveValues, {seedValues} from "./primitive-values.ts";
import {componentMapping, semanticMapping} from "./mapping.ts";
import {cssCustomProperties} from "./css-custom-properties.ts";
import type {CSSPropertyRegistration, CSSToken, CSSTokenDeclarations, CSSValue} from "../shared/types.ts";
import {toVarRef} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

/* Declarations: pair each token's custom property with its value. Primitive values are the generated ones;
   semantic and component values are var() references to whatever token their mapping points at. Seeds
   aren't tokens, so their CSS names are paired with them here directly. Registered, so they stay typed
   (and animatable) numbers. */

const HUE: CSSPropertyRegistration = {syntax: "<number> | <angle>", inherits: true, initialValue: 0};
const FRACTION: CSSPropertyRegistration = {syntax: "<number> | <percentage>", inherits: true, initialValue: 0};
const seedCssProperties = {
    "--color-brand-1-hue": {value: seedValues.brand1Hue, registration: HUE},
    "--color-brand-2-hue": {value: seedValues.brand2Hue, registration: HUE},
    "--color-brand-3-hue": {value: seedValues.brand3Hue, registration: HUE},
    "--color-brand-lightness": {value: seedValues.brandLightness, registration: FRACTION},
    "--color-brand-chroma": {value: seedValues.brandChroma, registration: FRACTION}
} satisfies { [K in CSSToken]: { value: CSSValue; registration: CSSPropertyRegistration } };

// Themes: where each theme's semantic tokens are declared, and the color-scheme declared with them.
const themes = {
    dark: {selector: ":root", colorScheme: "dark"}
} as const satisfies { [T in Theme]: { selector: string; colorScheme: string } };

export const seedCssDeclarations: CSSTokenDeclarations = ObjectStream.of(seedCssProperties)
    .mapValues(({value}) => value)
    .collect();
export const seedCssRegistrations: Record<CSSToken, CSSPropertyRegistration> = ObjectStream.of(seedCssProperties)
    .mapValues(({registration}) => registration)
    .collect();

function resolveTokenRef({tokenRef, alpha}: TokenRef): CSSValue {
    const varRef = toVarRef(cssCustomProperties[tokenRef]);
    return alpha === undefined ? varRef : `oklch(from ${varRef} l c h / ${alpha})`;
}

export const primitiveCssDeclarations: CSSTokenDeclarations = ObjectStream.of(primitiveValues)
    .mapKeys(token => cssCustomProperties[token])
    .collect();

export const themeCssDeclarations = ObjectStream.of(themes)
    .mapEntryToValue((theme, spec) => ({
        ...spec,
        declarations: ObjectStream.of(semanticMapping[theme])
            .mapEntries((token, ref) => [cssCustomProperties[token], resolveTokenRef(ref)])
            .collect() as CSSTokenDeclarations
    }))
    .collect();

export const componentCssDeclarations: CSSTokenDeclarations = ObjectStream.of(componentMapping)
    .mapEntries((token, ref) => [cssCustomProperties[token], resolveTokenRef(ref)])
    .collect();
