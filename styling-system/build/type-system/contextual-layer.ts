import {
    mapObjectEntries
} from "./shared.ts";
import type {
    ContextualToken,
    CSSPropertyValues, TypeTokensLayer
} from "./config.ts";

/* Context tokens: where the text sits in the page's content structure. They declare no custom
   properties of their own, only rules that resolve to semantic (and overriding primitive) variables. */

export default function getContextualLayer(contextualValues: Record<ContextualToken, CSSPropertyValues>): TypeTokensLayer {
    return {
        getCSSDeclarations() {
            return null;
        },
        getCSSRules() {
            return mapObjectEntries(
                contextualValues,
                (token, values) => [`.${token}`, values]
            );
        }
    };
}