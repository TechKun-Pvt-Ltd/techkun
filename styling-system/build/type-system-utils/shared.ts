export type CSSToken = `--${string}`;
export type CSSValue = string | number;
// type TokensByProperty = Record<string, string>;
export type CSSDeclarations = Record<CSSToken, CSSValue>;
export type CSSRules = {
    [selector: string]: {
        [P in Property]?: CSSValue;
    };
};

export interface TypeTokensLayer {
    getCSSDeclarations(): CSSDeclarations | null;
    getCSSRules(): CSSRules | null;
}

type CSSTokensLookup<T extends Record<string, string>> = {
    [P in keyof T]: {
        [K in T[P]]: CSSToken;
    };
};


/* Everything the token levels (primitives, semantic, context) have in common.
   Primitives are tied to a property, so their objects are keyed by property first: `object[property][token]`.
   Semantic and context tokens are tied to intent, so their objects are keyed by token first: `object[token][property]`. */

const T_SHIRT_SIZE_TOKENS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const;
const WEIGHT_TOKENS = ["regular", "medium", "semibold", "bold"] as const;

export type TShirtSizeToken = typeof T_SHIRT_SIZE_TOKENS[number];
export type WeightToken = typeof WEIGHT_TOKENS[number];
const TOKENS_BY_PROPERTY = {
    fontSize: T_SHIRT_SIZE_TOKENS,
    lineHeight: T_SHIRT_SIZE_TOKENS,
    letterSpacing: T_SHIRT_SIZE_TOKENS,
    fontWeight: WEIGHT_TOKENS
} satisfies Record<Property, readonly string[]>;

export type TokensByProperty = {
    [P in keyof typeof TOKENS_BY_PROPERTY]: typeof TOKENS_BY_PROPERTY[P][number];
};

export function getTokensByProperty<P extends Property>(property: P): typeof TOKENS_BY_PROPERTY[P] {
    return TOKENS_BY_PROPERTY[property];
}

export const PROPERTIES = ["fontSize", "lineHeight", "letterSpacing", "fontWeight"] as const;
export type Property = typeof PROPERTIES[number];

export const CSS_PROPERTY_NAME: Record<Property, string> = {
    fontSize: "font-size",
    lineHeight: "line-height",
    letterSpacing: "letter-spacing",
    fontWeight: "font-weight"
};

export function mapObjectEntries<O extends object, U extends keyof any, V>(object: O, mapper: (key: keyof O, value: O[keyof O]) => [U, V]): Record<U, V> {
    return Object.fromEntries(Object.entries(object)
        .map(([key, value]) => mapper(key as keyof O, value))) as any;
}
export function mapObjectValues<O extends object, V>(object: O, mapper: (value: O[keyof O]) => V): Record<keyof O, V> {
    return Object.fromEntries(Object.entries(object)
        .map(([key, value]) => [key, mapper(value)])) as any;
}
export function mapObjectKeys<O extends object, U extends keyof any>(object: O, mapper: (value: keyof O) => U): Record<U, O[keyof O]> {
    return Object.fromEntries(Object.entries(object)
        .map(([key, value]) => [mapper(key as keyof O), value])) as any;
}