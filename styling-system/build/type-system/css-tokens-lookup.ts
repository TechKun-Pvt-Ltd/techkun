import {CSSProperties, Schema} from "./schema.ts";
import {SemanticTokens} from "./mapping.ts";
import type {SemanticToken} from "./mapping.ts";
import type {CSSProperty, CSSPropertyOf, CSSToken, TokenFamily, TokenOf} from "./types.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import {createObjectFromEntries} from "./utils.ts";

/* Naming only: which CSS custom property a given token/property pair resolves to. Built from the
   schema and mapping - never from the actual values a token holds - so a token's declared shape never
   drifts from what it's assigned. */

type PrimitiveCssTokensLookup = {
    [F in TokenFamily]: {
        [T in TokenOf<F>]: {
            [CP in CSSPropertyOf<F>]: CSSToken;
        };
    };
};
function buildPrimitiveCssTokensLookup(cssTokenProvider: (token: TokenOf<TokenFamily>, cssProperty: CSSProperty) => CSSToken): PrimitiveCssTokensLookup {
    return ObjectStream.of(Schema)
        .mapValues(({ tokens, cssProperties }) => createObjectFromEntries(
            tokens.map(token => [
                token,
                createObjectFromEntries(cssProperties.map(cssProperty => [
                    cssProperty, cssTokenProvider(token, cssProperty)
                ]))
            ])
        ))
        .collect();
}

type SemanticCssTokensLookup = Record<SemanticToken, { [CP in CSSProperty]: CSSToken; }>;
function buildSemanticCssTokensLookup(cssTokenProvider: (semanticToken: SemanticToken, cssProperty: CSSProperty) => CSSToken): SemanticCssTokensLookup {
    return createObjectFromEntries(SemanticTokens
    .map(semanticToken => [
        semanticToken,
        createObjectFromEntries(CSSProperties.map(cssProperty => [cssProperty, cssTokenProvider(semanticToken, cssProperty)]))
    ] as const));
}

const primitiveCssTokensLookup = buildPrimitiveCssTokensLookup(
    (token, cssProperty) => `--${cssProperty}-${token}`
);
const semanticCssTokensLookup = buildSemanticCssTokensLookup(
    (semanticToken, cssProperty) => `--${semanticToken}-${cssProperty}`
);

export function lookupPrimitiveCssTokens<F extends TokenFamily>(family: F, token: TokenOf<F>): { [CP in CSSPropertyOf<F>]: CSSToken; } {
    return primitiveCssTokensLookup[family][token];
}
export function lookupSemanticCssTokens(token: SemanticToken): { [CP in CSSProperty]: CSSToken; } {
    return semanticCssTokensLookup[token];
}
