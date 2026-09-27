import {createObjectFromEntries} from "../utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";

export type SchemaShape = {
    primitive: { [proxyProperty: string]: { variants: readonly string[]; properties: readonly string[] } };
    semantic: { [role: string]: readonly string[] };
    contextual: readonly string[];
};
export type GetProxyProperty<S extends SchemaShape> = keyof S["primitive"];
export type GetCSSPropertyOf<S extends SchemaShape, P extends GetProxyProperty<S>> = UnwrapArray<S["primitive"][P]["properties"]>;

export type GetPropertyProxyMap<S extends SchemaShape> = { [P in GetProxyProperty<S>]: GetCSSPropertyOf<S, P>[]; };
export function getPropertyProxyMap<S extends SchemaShape>(schema: S) {
    return ObjectStream.of(schema.primitive)
        .mapValues(value => value.properties)
        .collect() as GetPropertyProxyMap<S>;
}

export type GetPrimitiveTokenVariant<S extends SchemaShape, P extends GetProxyProperty<S>> = S["primitive"][P]["variants"][number];
export type GetPrimitiveToken<S extends SchemaShape> = {
    [P in GetProxyProperty<S>]: FormatToken<P & string, GetPrimitiveTokenVariant<S, P>>;
}[GetProxyProperty<S>];

export type GetPrimitiveTokenLookup<S extends SchemaShape> = { [P in GetProxyProperty<S>]: { [V in GetPrimitiveTokenVariant<S, P>]: FormatToken<P & string, V> } };
export function getPrimitiveTokenLookup<S extends SchemaShape>(schema: S) {
    return ObjectStream.of(schema.primitive)
        .mapEntryToValue((proxyProperty, value) => createObjectFromEntries(
            value.variants.map(token => [token, formatToken(proxyProperty as string, token)] as const)
        ))
        .collect() as GetPrimitiveTokenLookup<S>;
}

export type GetSemanticTokenGroup<S extends SchemaShape> = keyof S["semantic"];
export type GetSemanticTokenVariant<S extends SchemaShape, TF extends GetSemanticTokenGroup<S>> = S["semantic"][TF][number];
export type GetSemanticToken<S extends SchemaShape> = {
    [G in GetSemanticTokenGroup<S>]: FormatToken<G & string, GetSemanticTokenVariant<S, G>>;
}[GetSemanticTokenGroup<S>];

export type GetSemanticTokenLookup<S extends SchemaShape> = {
    [G in GetSemanticTokenGroup<S>]: {
        [V in GetSemanticTokenVariant<S, G>]: FormatToken<G & string, V>;
    }
};
export function getSemanticTokenLookup<S extends SchemaShape>(schema: S) {
    return ObjectStream.of(schema.semantic)
        .mapEntryToValue((group, variants) => createObjectFromEntries(
            variants.map(variant => [variant, formatToken(group as string, variant)] as const)
        ))
        .collect() as GetSemanticTokenLookup<S>;
}

export type GetContextualToken<S extends SchemaShape> = S["contextual"][number];

export type FormatToken<S1 extends string, S2 extends string> = `${S1}-${S2}`;
function formatToken<S1 extends string, S2 extends string>(string1: S1, string2: S2): FormatToken<S1, S2> {
    return `${string1}-${string2}`;
}

type UnwrapArray<A extends readonly any[]> = A extends readonly any[] ? A[number] : never;
