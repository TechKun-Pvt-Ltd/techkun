import {Schema} from "./schema.ts";
import {ContextualToSemanticMap, SemanticToPrimitiveMap} from "./mapping.ts";
import type {ContextualToken, SemanticToken} from "./mapping.ts";
import {lookupPrimitiveCssTokens, lookupSemanticCssTokens} from "./css-tokens-lookup.ts";
import {lookupContextualCssValues} from "./css-values-lookup.ts";
import {createObjectFromEntries, toVarRefs} from "../shared/utils.ts";
import type {WeightToken} from "./types.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSRules} from "../shared/types.ts";

/* Rules: walk the schema/mapping for each level's tokens, and for each one query the CSS token/value
   a selector should resolve to. Primitive and semantic rules reference their own custom properties;
   contextual rules resolve straight to already-resolved values, since contextual tokens have none
   of their own. */

export const primitiveCssRules: CSSRules = createObjectFromEntries(
    Schema.weight.tokens.map(token =>
        [`.font-${token}`, toVarRefs(lookupPrimitiveCssTokens("weight", token))]
    )
);
export const semanticCssRules: CSSRules = ObjectStream.of(SemanticToPrimitiveMap)
    .mapKeyToEntry(token => [`.${token}`, toVarRefs(lookupSemanticCssTokens(token))])
    .collect();

export const contextualCssRules: CSSRules = ObjectStream.of(ContextualToSemanticMap)
    .mapKeyToEntry(token => [`.${token}`, lookupContextualCssValues(token)])
    .collect();