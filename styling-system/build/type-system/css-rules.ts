import {ContextualTokensList, primitiveTokens, SemanticTokensList} from "./schema.ts";
import type {AliasProperty, AliasToken, ContextualToken, SemanticToken, TokenOf} from "./schema.ts";
import {aliasCustomProperties, primitiveCustomProperties} from "./css-custom-properties.ts";
import {createObjectFromEntries, toVarRefs} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSRules} from "../shared/types.ts";

/* Rules: which tokens get a utility class, and its selector. Every rule sets its token's own custom properties.
   An alias property left out of `primitive` gets no primitive utilities - type sizes are only reachable
   through semantic tokens. */
const selectors = {
    primitive: {
        weight: token => `.font-${token}`
    },
    semantic: token => `.type-${token}`,
    contextual: token => `.${token}`
} as const satisfies {
    primitive: { [P in AliasProperty]?: (token: TokenOf<P>) => string };
    semantic: (token: SemanticToken) => string;
    contextual: (token: ContextualToken) => string;
};

export const primitiveCssRules: CSSRules = ObjectStream.of(selectors.primitive)
    .flatMap((aliasProperty, selector) => ObjectStream.of(primitiveTokens[aliasProperty])
        .mapEntries((token, flatToken) => [
            selector(token),
            toVarRefs(primitiveCustomProperties[flatToken])
        ])
    )
    .collect();

function aliasCssRules<T extends AliasToken>(tokens: T[], selector: (token: T) => string): CSSRules {
    return createObjectFromEntries(tokens.map(token => [selector(token), toVarRefs(aliasCustomProperties[token])]));
}
export const semanticCssRules: CSSRules = aliasCssRules(SemanticTokensList, selectors.semantic);
export const contextualCssRules: CSSRules = aliasCssRules(ContextualTokensList, selectors.contextual);
