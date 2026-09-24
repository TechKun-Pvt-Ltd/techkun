import {createObjectFromEntries} from "../shared/utils.ts";
import type {CSSValue} from "../shared/types.ts";

/* Every token of every level. Primitive tokens are grouped by alias property - a group of CSS properties
   a token sets together. Semantic tokens are grouped by role. Contextual tokens are a flat list. Semantic and
   contextual tokens set every alias property. This structure stays internal: it's transformed below into
   the flat token names, lookups for them, and the shapes mappings and values must adhere to. */
const schema = {
    primitive: {
        typeSize: {
            tokens: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
            properties: ["font-size", "line-height", "letter-spacing"]
        },
        weight: {
            tokens: ["regular", "medium", "semibold", "bold"],
            properties: ["font-weight"]
        }
    },
    semantic: {
        display: ["sm"],
        heading: ["sm", "md", "lg", "xl"],
        body: ["sm", "md", "lg"]
    },
    contextual: ["hero-heading", "section-title", "section-subtitle", "item-title", "item-subtitle", "logo-text"]
} as const satisfies {
    primitive: { [aliasProperty: string]: { tokens: readonly string[]; properties: readonly string[] } };
    semantic: { [role: string]: readonly string[] };
    contextual: readonly string[];
};
type Schema = typeof schema;

type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
    ? `${Head extends Lowercase<Head> ? Head : `-${Lowercase<Head>}`}${KebabCase<Tail>}`
    : S;
function kebabCase<S extends string>(s: S): KebabCase<S> {
    return s.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`) as KebabCase<S>;
}

export type AliasProperty = keyof Schema["primitive"];
export type TokenOf<P extends AliasProperty> = Schema["primitive"][P]["tokens"][number];
export type PropertyOf<P extends AliasProperty> = Schema["primitive"][P]["properties"][number];
export type CSSProperty = PropertyOf<AliasProperty>;
type Role = keyof Schema["semantic"];
type VariantOf<R extends Role> = Schema["semantic"][R][number];

/* Lookups: the nested structure a level is declared in, with the flat token name at each leaf -
   `semanticTokens.heading.xl` is `"heading-xl"`. */
type PrimitiveTokenLookup = { [P in AliasProperty]: { [T in TokenOf<P>]: `${KebabCase<P>}-${T}` } };
type SemanticTokenLookup = { [R in Role]: { [V in VariantOf<R>]: `${R}-${V}` } };

export const primitiveTokens = createObjectFromEntries((Object.keys(schema.primitive) as AliasProperty[])
    .map(aliasProperty => [aliasProperty, createObjectFromEntries(schema.primitive[aliasProperty].tokens
        .map(token => [token, `${kebabCase(aliasProperty)}-${token}`])
    )])
) as PrimitiveTokenLookup;
export const semanticTokens = createObjectFromEntries((Object.keys(schema.semantic) as Role[])
    .map(role => [role, createObjectFromEntries(schema.semantic[role]
        .map(variant => [variant, `${role}-${variant}`])
    )])
) as SemanticTokenLookup;

type Lookup = { readonly [key: string]: string | Lookup };
type LeafOf<L> = L extends string ? L : { [K in keyof L]: LeafOf<L[K]> }[keyof L];
type Shaped<L, V> = L extends string ? V : { [K in keyof L]: Shaped<L[K], V> };
type LeafValueOf<L, N> = L extends string ? N : { [K in keyof L & keyof N]: LeafValueOf<L[K], N[K]> }[keyof L & keyof N];

function leavesOf<L extends Lookup>(lookup: L): LeafOf<L>[] {
    return Object.values(lookup).flatMap(entry => typeof entry === "string" ? [entry] : leavesOf(entry)) as LeafOf<L>[];
}

export type PrimitiveToken = LeafOf<PrimitiveTokenLookup>;
export type SemanticToken = LeafOf<SemanticTokenLookup>;
export type ContextualToken = Schema["contextual"][number];
export type AliasToken = SemanticToken | ContextualToken;

export const PrimitiveTokens: PrimitiveToken[] = leavesOf(primitiveTokens);
export const SemanticTokens: SemanticToken[] = leavesOf(semanticTokens);
export const ContextualTokens: ContextualToken[] = [...schema.contextual];

// Alias property -> the CSS properties it aliases.
export const AliasProperties = createObjectFromEntries((Object.keys(schema.primitive) as AliasProperty[])
    .map(aliasProperty => [aliasProperty, schema.primitive[aliasProperty].properties])
) as { [P in AliasProperty]: Schema["primitive"][P]["properties"] };

/* Refs: how a higher level points at a lower one. Primitive tokens are referenced by their raw token per
   alias property. */
export type PrimitiveTokenRef = { [P in AliasProperty]: TokenOf<P> };
export type AliasTokenRef = {
    tokenRef: SemanticToken;
    primitiveOverrides?: Partial<PrimitiveTokenRef>;
};

// Shapes values and mappings are declared in.
export type PrimitiveValues = { [P in AliasProperty]: { [T in TokenOf<P>]: { [CP in PropertyOf<P>]: CSSValue } } };
export type SemanticMapping = Shaped<SemanticTokenLookup, PrimitiveTokenRef>;
export type ContextualMapping = { [T in ContextualToken]: AliasTokenRef };

/* Flattens a structure declared in a lookup's shape into a map from the lookup's flat token names to the
   values at the same paths. Driven by the lookup, so values can be objects themselves. */
export function flatten<L extends Lookup, N extends Shaped<L, unknown>>(lookup: L, nested: N): { [T in LeafOf<L>]: LeafValueOf<L, N> } {
    return createObjectFromEntries(flattenEntries(lookup, nested)) as { [T in LeafOf<L>]: LeafValueOf<L, N> };
}
function flattenEntries(lookup: Lookup, nested: any): [string, unknown][] {
    return Object.entries(lookup).flatMap(([key, entry]) =>
        typeof entry === "string" ? [[entry, nested[key]]] : flattenEntries(entry, nested[key])
    );
}
