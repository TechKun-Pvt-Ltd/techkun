import primitiveValues from "./primitive-values.ts";
import {toVarRefs} from "./utils.ts";
import {lookupPrimitiveCssTokens, lookupSemanticCssTokens} from "./css-tokens-lookup.ts";
import {ContextualToSemanticMap, SemanticToPrimitiveMap} from "./mapping.ts";
import type {ContextualToken, SemanticToken} from "./mapping.ts";
import type {CSSPropertyOf, CSSPropertyValues, TokenFamily, TokenOf} from "./schema.ts";
import type {CSSValue, PrimitiveMapping} from "./types.ts";

/* Resolved values, one query function per level. Primitive values are read straight off the raw data;
   semantic and contextual values are var() references resolved by following the mapping down to
   whichever primitive/semantic CSS tokens it points at. */

export function lookupPrimitiveCssValues<F extends TokenFamily>(family: F, token: TokenOf<F>): CSSPropertyValues<F> {
    return primitiveValues[family][token] as CSSPropertyValues<F>;
}

function resolvePrimitiveVarRefs<PM extends Partial<PrimitiveMapping>>(
    mapping: PM
): { [CP in CSSPropertyOf<keyof PM & TokenFamily>]: CSSValue } {
    return Object.entries(mapping)
        .map(([family, token]) => lookupPrimitiveCssTokens(family as TokenFamily, token as never))
        .map(toVarRefs)
        .reduce((a, b) => Object.assign(a, b), {} as CSSPropertyValues);
}

export function lookupSemanticCssValues(token: SemanticToken): CSSPropertyValues {
    return resolvePrimitiveVarRefs(SemanticToPrimitiveMap[token]);
}

export function lookupContextualCssValues(token: ContextualToken): CSSPropertyValues {
    const mapping = ContextualToSemanticMap[token];
    return {
        ...toVarRefs(lookupSemanticCssTokens(mapping.semanticToken)),
        ...(mapping.primitiveOverrides ? resolvePrimitiveVarRefs(mapping.primitiveOverrides) : null)
    };
}
