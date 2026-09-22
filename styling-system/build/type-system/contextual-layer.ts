import {ObjectStream} from "../../../lib/object-stream.ts";
import type {
    ContextualToken
} from "./mapping.ts";
import type {TypeTokensLayer} from "./types.ts";
import type {CSSPropertyValues} from "./schema.ts";

/* Context tokens: where the text sits in the page's content structure. They declare no custom
   properties of their own, only rules that resolve to semantic (and overriding primitive) variables. */

export default function getContextualLayer(contextualValues: Record<ContextualToken, CSSPropertyValues>): TypeTokensLayer {
    return {
        getCSSTokenDeclarations() {
            return null;
        },
        getCSSRules() {
            return ObjectStream.of(contextualValues).mapKeys(token => `.${token}`).collect();
        }
    };
}