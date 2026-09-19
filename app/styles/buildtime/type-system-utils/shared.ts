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

export function mapObjectEntries<O extends object, U>(object: O, mapper: (key: keyof O, value: O[keyof O]) => [keyof O, U]): Record<keyof O, U> {
    return Object.fromEntries(Object.entries(object)
        .map(([key, value]) => mapper(key as keyof O, value))) as any;
}
export function mapObjectValues<O extends object, U>(object: O, mapper: (value: O[keyof O]) => U): Record<keyof O, U> {
    return Object.fromEntries(Object.entries(object)
        .map(([key, value]) => [key, mapper(value)])) as any;
}

// Declarations: pairs each value with the lookup name at the same path -> {"--custom-property": value}.
export function declare<V extends Record<string, Record<string, string | number>>>(values: V, lookup: { [K in keyof V]: { [K1 in keyof V[K]]: string; } }) {
    const declarations: Record<string, string | number> = {};
    for (const [outerKey, inner] of Object.entries(values)) {
        for (const [innerKey, value] of Object.entries(inner)) {
            const name = lookup[outerKey]?.[innerKey];
            if (name === undefined)
                throw new Error(`No property name for "${outerKey}" / "${innerKey}"`);
            declarations[name] = value;
        }
    }
    return declarations;
}

// Emits `selector { ... }` from a {property: value} object.
export function rule(selector: string, values: Record<string, string>) {
    const declarations = Object
        .entries(values)
        .map(([property, value]) => `    ${CSS_PROPERTY_NAME[property as Property]}: ${value};`);
    return `${selector} {\n${declarations.join("\n")}\n}`;
}
