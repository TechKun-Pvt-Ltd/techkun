import {PROPERTIES, declare, rule, mapObjectValues, mapObjectEntries} from "./shared.ts";
import type {TShirtSizeToken, WeightToken, Property, TokensByProperty} from "./shared.ts";
import {resolvePrimitiveToken} from "./primitives.ts";

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

const SEMANTIC_TO_PRIMITIVE = Object.fromEntries(Object
    .entries(semanticToPrimitiveGrouped)
    .flatMap(([role, sizes]) => Object
        .entries(sizes)
        .map(([size, tokens]) => [`type-${role}-${size}`, tokens])
    )
) as Record<SemanticToken, { [P in Property]: TokensByProperty[P] }>;

const SEMANTIC_TOKENS = Object.keys(SEMANTIC_TO_PRIMITIVE) as SemanticToken[];

const SEMANTIC_SUFFIX: Record<Property, string> = {
    fontSize: "size",
    lineHeight: "line-height",
    letterSpacing: "letter-spacing",
    fontWeight: "weight"
};

// Lookup: token -> CSS custom property name. [token][property].
const SEMANTIC_PROPERTY_NAMES_BY_TOKEN = Object.fromEntries(SEMANTIC_TOKENS
    .map(token => [
        token,
        Object.fromEntries(
            PROPERTIES.map(property => [property, `--${token}-${SEMANTIC_SUFFIX[property]}`])
        )
    ])
) as Record<SemanticToken, Record<Property, string>>;

export function resolveSemanticToken(token: SemanticToken) {
    if (!(token in SEMANTIC_PROPERTY_NAMES_BY_TOKEN))
        throw new Error(`Unknown semantic token "${token}"`);
    return mapObjectValues(SEMANTIC_PROPERTY_NAMES_BY_TOKEN[token], propertyName => `var(${propertyName})`);
}

// Custom properties declared under :root: name -> value.
export const SEMANTIC_PROPERTIES = declare(
    mapObjectValues(
        SEMANTIC_TO_PRIMITIVE,
        mapping => mapObjectEntries(
            mapping,
            (property, token) => [property, resolvePrimitiveToken(property, token)]
        )
    ),
    SEMANTIC_PROPERTY_NAMES_BY_TOKEN
);

export const SEMANTIC_RULES = Object
    .entries(SEMANTIC_PROPERTY_NAMES_BY_TOKEN)
    .map(([token, values]) => rule(
        `.${token}`,
        mapObjectValues(values, value => `var(${value})`)
    ));
