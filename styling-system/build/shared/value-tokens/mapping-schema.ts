import type {
    GetComponentTokenGroup,
    GetComponentTokenVariant,
    GetPrimitiveToken,
    GetSemanticToken,
    GetSemanticTokenGroup,
    GetSemanticTokenLookup,
    GetSemanticTokenVariant,
    GetTheme,
    SchemaShape
} from "./schema-shape.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";

/* Refs: how a higher level points at a lower one - a token whose value it takes. An implementation may extend
   a ref with whatever it modifies that value by, so mappings are typed by the ref R they hold. */
export type GetTokenRef<S extends SchemaShape> = { tokenRef: GetPrimitiveToken<S> | GetSemanticToken<S> };

// Every theme maps the same semantic tokens.
export type GetGroupedSemanticMapping<S extends SchemaShape, R extends GetTokenRef<S>> = {
    [Th in GetTheme<S>]: { [G in GetSemanticTokenGroup<S>]: { [V in GetSemanticTokenVariant<S, G>]: R } }
};
export type GetSemanticMapping<S extends SchemaShape, R extends GetTokenRef<S>> = {
    [Th in GetTheme<S>]: { [T in GetSemanticToken<S>]: R }
};

// Only the nested shape: how component tokens are named, and so the flat shape, is up to the implementation.
export type GetGroupedComponentMapping<S extends SchemaShape, R extends GetTokenRef<S>> = {
    [C in GetComponentTokenGroup<S>]: { [V in GetComponentTokenVariant<S, C>]: R }
};

type SemanticMappingFlattener<S extends SchemaShape, R extends GetTokenRef<S>> = (mapping: GetGroupedSemanticMapping<S, R>) => GetSemanticMapping<S, R>;

export function getSemanticMappingFlattener<S extends SchemaShape, R extends GetTokenRef<S>>(semanticTokens: GetSemanticTokenLookup<S>): SemanticMappingFlattener<S, R> {
    return mapping => ObjectStream.of(mapping)
        .mapValues(themeMapping => ObjectStream.of(semanticTokens)
            .flatMap((group, variants) => ObjectStream.of(variants)
                .mapEntries<GetSemanticToken<S>, R>((variant, token) => [
                    token, (themeMapping[group] as Record<string, R>)[variant]
                ])
            )
            .collect()
        )
        .collect() as GetSemanticMapping<S, R>;
}
