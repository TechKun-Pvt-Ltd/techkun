import {PaletteTokens, Themes} from "./schema.ts";
import {seedValues} from "./primitive-values.ts";
import {ComponentTokens, SemanticTokens} from "./mapping.ts";
import {lookupComponentCssToken, lookupPrimitiveCssToken, lookupSemanticCssToken} from "./css-tokens-lookup.ts";
import {lookupComponentCssValue, lookupPrimitiveCssValue, lookupSemanticCssValue} from "./css-values-lookup.ts";
import type {Theme} from "./types.ts";
import type {CSSPropertyRegistration, CSSToken, CSSTokenDeclarations} from "../shared/types.ts";
import {createObjectFromEntries} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

/* Declarations: walk each level's tokens and zip their CSS-token lookup with their resolved value. Seeds
   aren't tokens - their CSS names are written out where they're defined - so they're read off as they are. */

export const seedCssDeclarations: CSSTokenDeclarations = ObjectStream.of(seedValues)
    .mapValues(({value}) => value)
    .collect();
export const seedCssRegistrations: Record<CSSToken, CSSPropertyRegistration> = ObjectStream.of(seedValues)
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
