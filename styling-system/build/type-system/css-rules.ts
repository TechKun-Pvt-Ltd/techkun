import {contextualTokensList, primitiveTokens, semanticTokensList} from "./schema.ts";
import type {ProxyProperty, AliasToken, ContextualToken, SemanticToken, PrimitiveTokenVariant} from "./schema.ts";
import {aliasCustomProperties, primitiveCustomProperties} from "./css-custom-properties.ts";
import {createObjectFromEntries, mergeAll, toVarRefs} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSRules} from "../shared/types.ts";

/* Rules: which tokens get a utility class, and its selector. Every rule sets its token's own custom properties.
   A proxy property left out of `primitive` gets no primitive utilities - type sizes are only reachable
   through semantic tokens. */
const selectors = {
    primitive: {
        weight: token => `.font-${token}`
    },
    semantic: token => `.type-${token}`,
    contextual: token => `.${token}`
} as const satisfies {
    primitive: { [P in ProxyProperty]?: (token: PrimitiveTokenVariant<P>) => string };
    semantic: (token: SemanticToken) => string;
    contextual: (token: ContextualToken) => string;
};

const primitiveCssRules: CSSRules = ObjectStream.of(selectors.primitive)
    .flatMap((proxyProperty, selector) => ObjectStream.of(primitiveTokens[proxyProperty])
        .mapEntries((variant, token) => [
            selector(variant),
            toVarRefs(primitiveCustomProperties[token])
        ])
    )
    .collect();

function aliasTokenCssRules<T extends AliasToken>(tokens: T[], selector: (token: T) => string): CSSRules {
    return createObjectFromEntries(tokens.map(token => [selector(token), toVarRefs(aliasCustomProperties[token])]));
}
const semanticCssRules: CSSRules = aliasTokenCssRules(semanticTokensList, selectors.semantic);
const contextualCssRules: CSSRules = aliasTokenCssRules(contextualTokensList, selectors.contextual);

const rules = mergeAll([primitiveCssRules, semanticCssRules, contextualCssRules]);
export default rules;