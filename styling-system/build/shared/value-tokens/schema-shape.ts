import {formatToken, type FormatToken} from "../composite-tokens/schema-shape.ts";
import {createObjectFromEntries} from "../utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";

export type SchemaShape = {
    primitive: { [group: string]: readonly string[] };
    semantic: { [group: string]: readonly string[] };
    component: { [component: string]: readonly string[] };
    themes: readonly string[];
};

export type GetPrimitiveTokenGroup<S extends SchemaShape> = keyof S["primitive"];
export type GetPrimitiveTokenVariant<S extends SchemaShape, G extends GetPrimitiveTokenGroup<S>> = S["primitive"][G][number];
export type GetPrimitiveToken<S extends SchemaShape> = {
    [G in GetPrimitiveTokenGroup<S>]: FormatToken<G & string, GetPrimitiveTokenVariant<S, G>>;
}[GetPrimitiveTokenGroup<S>];

export type GetPrimitiveTokenLookup<S extends SchemaShape> = {
    [G in GetPrimitiveTokenGroup<S>]: {
        [V in GetPrimitiveTokenVariant<S, G>]: FormatToken<G & string, V>;
    }
};
export function getPrimitiveTokenLookup<S extends SchemaShape>(schema: S) {
    return ObjectStream.of(schema.primitive)
        .mapEntryToValue((group, variants) => createObjectFromEntries(
            variants.map(variant => [variant, formatToken(group as string, variant)] as const)
        ))
        .collect() as GetPrimitiveTokenLookup<S>;
}

export type GetSemanticTokenGroup<S extends SchemaShape> = keyof S["semantic"];
export type GetSemanticTokenVariant<S extends SchemaShape, G extends GetSemanticTokenGroup<S>> = S["semantic"][G][number];
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

// How component tokens are named from these is up to the implementation.
export type GetComponentTokenGroup<S extends SchemaShape> = keyof S["component"];
export type GetComponentTokenVariant<S extends SchemaShape, C extends GetComponentTokenGroup<S>> = S["component"][C][number];

export type GetTheme<S extends SchemaShape> = S["themes"][number];
