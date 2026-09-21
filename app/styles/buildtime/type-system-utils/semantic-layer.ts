import {PROPERTIES, mapObjectValues, mapObjectEntries} from "./shared.ts";
import type {TShirtSizeToken, WeightToken, Property, TokensByProperty, TypeTokensLayer, CSSToken} from "./shared.ts";
import {resolvePrimitiveToken} from "./primitive-layer.ts";

/* Semantic tokens: type roles (display, heading, body), each mapped onto primitive tokens. */

function primitiveTokens(size: TShirtSizeToken, weight: WeightToken = "regular") {
    return {fontSize: size, lineHeight: size, letterSpacing: size, fontWeight: weight};
}
// Semantic tokens: type role -> scale (sm/md/lg/xl) -> primitive tokens.
// Only the steps the site actually uses are defined.
const semanticToPrimitiveGrouped = {
    display: {
        sm: primitiveTokens("5xl")
    },
    heading: {
        sm: primitiveTokens("xl"),
        md: primitiveTokens("2xl"),
        lg: primitiveTokens("3xl"),
        xl: primitiveTokens("4xl")
    },
    body: {
        sm: primitiveTokens("sm"),
        md: primitiveTokens("base"),
        lg: primitiveTokens("lg")
    }
};

type SemanticToPrimitiveGrouped = typeof semanticToPrimitiveGrouped;
type KeysOfUnion<T> = T extends unknown ? keyof T : never;
export type SemanticToken = KeysOfUnion<{
    [R in keyof SemanticToPrimitiveGrouped]: {
        [S in `type-${R}-${keyof (SemanticToPrimitiveGrouped[R]) & string}`]: S
    };
}[keyof SemanticToPrimitiveGrouped]>;

const SemanticToPrimitive = Object.fromEntries(Object
    .entries(semanticToPrimitiveGrouped)
    .flatMap(([role, sizes]) => Object
        .entries(sizes)
        .map(([size, tokens]) => [`type-${role}-${size}`, tokens])
    )
) as Record<SemanticToken, { [P in Property]: TokensByProperty[P] }>;

const SEMANTIC_TOKENS = Object.keys(SemanticToPrimitive) as SemanticToken[];

const SEMANTIC_SUFFIX: Record<Property, string> = {
    fontSize: "size",
    lineHeight: "line-height",
    letterSpacing: "letter-spacing",
    fontWeight: "weight"
};

const SemanticLayer: TypeTokensLayer = {
    getCSSDeclarations() {
        return Object.fromEntries(Object
            .entries(SemanticCssTokensLookup)
            .flatMap(([semanticToken, lookup]) => Object
                .entries(lookup)
                .map(([property, cssToken]) => [
                    semanticToken, property, cssToken
                ] as [SemanticToken, Property, CSSToken])
            )
            .map(([semanticToken, property, cssToken]) => [
                cssToken, resolvePrimitiveToken(property, SemanticToPrimitive[semanticToken][property])
            ])
        );
    },
    getCSSRules() {
        return mapObjectEntries(
            SemanticCssTokensLookup,
            (token, values) => [
                `.${token}`,
                mapObjectValues(values, value => `var(${value})`)
            ]
        );
    }
};
export default SemanticLayer;

// Lookup: token -> CSS custom property name. [token][property].
const SemanticCssTokensLookup = Object.fromEntries(SEMANTIC_TOKENS
    .map(token => [
        token,
        Object.fromEntries(
            PROPERTIES.map(property => [property, `--${token}-${SEMANTIC_SUFFIX[property]}`])
        )
    ])
) as Record<SemanticToken, Record<Property, CSSToken>>;

export function resolveSemanticToken(token: SemanticToken) {
    if (!(token in SemanticCssTokensLookup))
        throw new Error(`Unknown semantic token "${token}"`);
    return mapObjectValues(SemanticCssTokensLookup[token], propertyName => `var(${propertyName})`);
}