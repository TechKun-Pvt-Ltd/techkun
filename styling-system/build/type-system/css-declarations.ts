import {CSSProperties, Schema} from "./schema.ts";
import {standaloneValues} from "./primitive-values.ts";
import {SemanticToPrimitiveMap} from "./mapping.ts";
import {lookupPrimitiveCssTokens, lookupSemanticCssTokens} from "./css-tokens-lookup.ts";
import {lookupPrimitiveCssValues, lookupSemanticCssValues} from "./css-values-lookup.ts";
import type {CSSProperty, TokenFamily} from "./types.ts";
import {createObjectFromEntries} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSToken, CSSTokenDeclarations, CSSValue} from "../shared/types.ts";

/* Declarations: walk the schema/mapping for each level's tokens, and for each one zip its CSS-token
   lookup together with its resolved value. No contextual declarations - contextual tokens declare no
   custom properties of their own, they only ever appear on the right-hand side of a rule. Standalone values
   aren't tokens, so their CSS names are paired with them here directly. */

export const standaloneCssDeclarations: CSSTokenDeclarations = {
    "--scale-ratio": standaloneValues.scaleRatio,
    "--ls-offset": standaloneValues.letterSpacingOffset
};

function buildPrimitiveCssDeclarations(): CSSTokenDeclarations {
    const groups: Record<CSSProperty, [CSSToken, CSSValue][]> = createObjectFromEntries(CSSProperties.map(p => [p, []]));
    for (const family of Object.keys(Schema) as TokenFamily[]) {
        for (const token of Schema[family].tokens) {
            const cssTokens = lookupPrimitiveCssTokens(family, token);
            const values = lookupPrimitiveCssValues(family, token);
            for (const cssProperty of Object.keys(cssTokens) as CSSProperty[]) {
                groups[cssProperty].push([cssTokens[cssProperty], values[cssProperty]]);
            }
        }
    }
    return createObjectFromEntries(CSSProperties.flatMap(p => groups[p]));
}
export const primitiveCssDeclarations: CSSTokenDeclarations = buildPrimitiveCssDeclarations();

function buildSemanticCssDeclarations(): CSSTokenDeclarations {
    return ObjectStream.of(SemanticToPrimitiveMap)
        .flatMap(token => {
            const cssTokens = lookupSemanticCssTokens(token);
            const values = lookupSemanticCssValues(token);
            return ObjectStream.of(cssTokens)
                .mapKeyToEntry(cssProperty => [cssTokens[cssProperty], values[cssProperty]]);
        })
        .collect();
}
export const semanticCssDeclarations: CSSTokenDeclarations = buildSemanticCssDeclarations();
