import {PaletteTokens, Themes} from "./schema.ts";
import {seedValues} from "./primitive-values.ts";
import {ComponentTokens, SemanticTokens} from "./mapping.ts";
import {lookupComponentCssToken, lookupPrimitiveCssToken, lookupSemanticCssToken} from "./css-tokens-lookup.ts";
import {lookupComponentCssValue, lookupPrimitiveCssValue, lookupSemanticCssValue} from "./css-values-lookup.ts";
import type {Theme} from "./types.ts";
import type {CSSPropertyRegistration, CSSToken, CSSTokenDeclarations, CSSValue} from "../shared/types.ts";
import {createObjectFromEntries} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

/* Declarations: walk each level's tokens and zip their CSS-token lookup with their resolved value. Seeds
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

export const seedCssDeclarations: CSSTokenDeclarations = ObjectStream.of(seedCssProperties)
    .mapValues(({value}) => value)
    .collect();
export const seedCssRegistrations: Record<CSSToken, CSSPropertyRegistration> = ObjectStream.of(seedCssProperties)
    .mapValues(({registration}) => registration)
    .collect();

export const primitiveCssDeclarations: CSSTokenDeclarations = createObjectFromEntries(
    PaletteTokens.map(token => [lookupPrimitiveCssToken(token), lookupPrimitiveCssValue(token)])
);

export const semanticCssDeclarations: Record<Theme, CSSTokenDeclarations> = ObjectStream.of(Themes)
    .mapKeyToValue(theme => createObjectFromEntries(
        SemanticTokens.map(token => [lookupSemanticCssToken(token), lookupSemanticCssValue(theme, token)])
    ))
    .collect();

export const componentCssDeclarations: CSSTokenDeclarations = createObjectFromEntries(
    ComponentTokens.map(token => [lookupComponentCssToken(token), lookupComponentCssValue(token)])
);
