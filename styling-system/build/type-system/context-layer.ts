import {
    mapObjectEntries
} from "./shared.ts";
import type {TypeTokensLayer} from "./shared.ts";
import type {
    ContextualToken,
    CSSPropertyValues
} from "./config.ts";

/* Context tokens: where the text sits in the page's content structure. They declare no custom
   properties of their own, only rules that resolve to semantic (and overriding primitive) variables. */

export default function getContextualLayer(values: Record<ContextualToken, CSSPropertyValues>): TypeTokensLayer {
    return {
        getCSSDeclarations() {
            return null;
        },
        getCSSRules() {
            return mapObjectEntries(
                values,
                (token, values) => [`.${token}`, values]
            );
        }
    };
}