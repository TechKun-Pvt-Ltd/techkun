import {ContextualTokens, primitiveTokens, SemanticTokens} from "./schema.ts";
import type {AliasProperty, AliasToken, ContextualToken, SemanticToken, TokenOf} from "./schema.ts";
import {aliasCustomProperties, primitiveCustomProperties} from "./css-custom-properties.ts";
import {createObjectFromEntries, toVarRefs} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSRules} from "../shared/types.ts";

/* Rules: which tokens get a utility class, and its selector. Every rule sets its token's own custom properties.
   An alias property left out of `primitive` gets no primitive utilities - type sizes are only reachable
   through semantic tokens. */
const selectors: {
    primitive: { [P in AliasProperty]?: (token: TokenOf<P>) => string };
    semantic: (token: SemanticToken) => string;
    contextual: (token: ContextualToken) => string;
} = {
    primitive: {
        weight: token => `.font-${token}`
    },
    semantic: token => `.type-${token}`,
    contextual: token => `.${token}`
};

export const primitiveCssRules: CSSRules = ObjectStream.of(selectors.primitive)
    .flatMap((aliasProperty, selector) => ObjectStream.of(primitiveTokens[aliasProperty])
        .mapEntries((token, flatToken) => [
            (selector as (token: string) => string)(token),
            toVarRefs(primitiveCustomProperties[flatToken] as Record<string, `--${string}`>)
        ])
    )
    .collect();

function aliasCssRules<T extends AliasToken>(tokens: T[], selector: (token: T) => string): CSSRules {
    return createObjectFromEntries(tokens.map(token => [selector(token), toVarRefs(aliasCustomProperties[token])]));
}
export const semanticCssRules: CSSRules = aliasCssRules(SemanticTokens, selectors.semantic);
export const contextualCssRules: CSSRules = aliasCssRules(ContextualTokens, selectors.contextual);
