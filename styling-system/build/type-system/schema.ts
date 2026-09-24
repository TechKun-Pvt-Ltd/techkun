import {createObjectFromEntries} from "../shared/utils.ts";
import type {CSSValue} from "../shared/types.ts";
import {ObjectStream, type Value} from "../../../lib/object-stream.ts";

/* Every token of every level. Primitive tokens are grouped by alias property - a group of CSS properties
   a token sets together. Semantic tokens are grouped by role. Contextual tokens are a flat list. Semantic and
   contextual tokens set every alias property. This structure stays internal: it's transformed below into
   the flat token names, lookups for them, and the shapes mappings and values must adhere to. */
const schema = {
    primitive: {
        "type-size": {
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

// type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
//     ? `${Head extends Lowercase<Head> ? Head : `-${Lowercase<Head>}`}${KebabCase<Tail>}`
//     : S;
// function kebabCase<S extends string>(s: S): KebabCase<S> {
//     return s.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`) as KebabCase<S>;
// }

export type AliasProperty = keyof Schema["primitive"];
export type TokenOf<P extends AliasProperty> = Schema["primitive"][P]["tokens"][number];
export type PropertyOf<P extends AliasProperty> = Schema["primitive"][P]["properties"][number];
export type CSSProperty = PropertyOf<AliasProperty>;

type Role = keyof Schema["semantic"];
type VariantOf<R extends Role> = Schema["semantic"][R][number];

export type PrimitiveToken = { [P in AliasProperty]: `${P}-${TokenOf<P>}` }[AliasProperty];
export type SemanticToken = { [R in Role]: `${R}-${VariantOf<R>}` }[Role];
export type ContextualToken = Schema["contextual"][number];
export type AliasToken = SemanticToken | ContextualToken;

/* Lookups: the nested structure a level is declared in, with the flat token name at each leaf -
   `semanticTokens.heading.xl` is `"heading-xl"`. */
type PrimitiveTokenLookup = { [P in AliasProperty]: { [T in TokenOf<P>]: `${P}-${T}` } };
type SemanticTokenLookup = { [R in Role]: { [V in VariantOf<R>]: `${R}-${V}` } };

export const primitiveTokens = ObjectStream.of(schema.primitive)
    .mapEntryToValue((aliasProperty, value) => createObjectFromEntries(
        value.tokens.map(token => [token, `${aliasProperty}-${token}` as PrimitiveToken] as const)
    ))
    .collect() as PrimitiveTokenLookup;
export const semanticTokens = ObjectStream.of(schema.semantic)
    .mapEntryToValue((role, value) => createObjectFromEntries(
        value.map(variant => [variant, `${role}-${variant}` as SemanticToken] as const)
    ))
    .collect() as SemanticTokenLookup;

// Flat token names of each level, filled in as the lookups below are built.
export const PrimitiveTokensList: PrimitiveToken[] = Object.values(primitiveTokens).flatMap(Object.values);
export const SemanticTokensList: SemanticToken[] = Object.values(semanticTokens).flatMap(Object.values);
export const ContextualTokensList: ContextualToken[] = [...schema.contextual];

// Alias property -> the CSS properties it aliases.
export const AliasProperties = ObjectStream.of(schema.primitive)
    .mapValues(value => value.properties)
    .collect() as { [P in AliasProperty]: Schema["primitive"][P]["properties"] };

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
type Lookup = { readonly [group: string]: { readonly [key: string]: string } };
type Shaped<L extends Lookup, V> = { [G in keyof L]: { [K in keyof L[G]]: V } };

export function flatten<L extends Lookup, N extends Shaped<L, unknown>>(lookup: L, nested: N): { [T in Value<Value<L>>]: Value<Value<N>> } {
    return ObjectStream.of(lookup)
        .flatMap((group, tokens) => ObjectStream.of(tokens)
            .mapEntries<Value<Value<L>>, Value<Value<N>>>((key, flatToken) => [flatToken, (nested as any)[group][key]])
        )
        .collect();
}
