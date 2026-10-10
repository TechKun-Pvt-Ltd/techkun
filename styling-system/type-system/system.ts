import {CompositeSchema, type CompositeSchemaShape, type GetSemanticMappingTokenRef} from "../shared/composite-tokens/schema.ts";
import {
    CompositeTokenStore, type GetComponentMapping, type GetPrimitiveValues, type GetSemanticMapping
} from "../shared/composite-tokens/token-store.ts";
import type {StandaloneValues} from "../shared/standalones.ts";
import {createObjectFromEntries, hyphenJoin, type HyphenJoin} from "../shared/utils.ts";
import {ObjectStream} from "../../lib/object-stream.ts";

/* The type system's own entities, and the one place its nested structures (the spec, grouped content) are
   transformed into the flat structures the shared entities work with. Primitive and component tokens are
   already flat; only semantic tokens are grouped. */

// ========== Spec ==========

/* The structure every type spec declares its tokens in. Primitive tokens are grouped by proxy property - a group
   of CSS properties a token sets together. Semantic tokens are grouped by role. Component tokens are a flat list.
   Semantic and component tokens set every proxy property. */
export type TypeSystemSchemaShape = {
    primitive: CompositeSchemaShape["primitive"];
    semantic: { [role: string]: readonly string[] };
    component: readonly string[];
};

// ========== Lookups ==========

/* `typeSchema.semantic.heading.xl` is `"heading-xl"`. */

type ElementOf<A> = A extends readonly (infer E extends string)[] ? E : never;

export type GetSemanticTokenGroup<S extends TypeSystemSchemaShape> = keyof S["semantic"] & string;
export type GetSemanticTokenVariant<S extends TypeSystemSchemaShape, G extends GetSemanticTokenGroup<S>> = ElementOf<S["semantic"][G]>;
type GetSemanticTokenLookup<S extends TypeSystemSchemaShape> = { [G in GetSemanticTokenGroup<S>]: { [V in GetSemanticTokenVariant<S, G>]: HyphenJoin<G, V> } };
type Leaf<L> = { [K in keyof L]: L[K][keyof L[K]] }[keyof L];

// ========== Schema ==========

export type GetFlatSchema<S extends TypeSystemSchemaShape> = {
    primitive: S["primitive"];
    semantic: readonly Leaf<GetSemanticTokenLookup<S>>[];
    component: S["component"];
};

export class TypeSchema<S extends TypeSystemSchemaShape> extends CompositeSchema<GetFlatSchema<S>> {
    readonly semantic: GetSemanticTokenLookup<S>;

    constructor(spec: S) {
        const semantic = ObjectStream.of(spec.semantic as { [role: string]: readonly string[] })
            .mapEntryToValue((group, variants) => createObjectFromEntries(variants.map(variant => [variant, hyphenJoin(group as string, variant)] as const)))
            .collect() as GetSemanticTokenLookup<S>;
        super({
            primitive: spec.primitive,
            semantic: Object.values(semantic).flatMap(variants => Object.values(variants)) as Leaf<GetSemanticTokenLookup<S>>[],
            component: spec.component
        }, "type");
        this.semantic = semantic;
    }
}

// ========== Content ==========

export type GetGroupedSemanticMapping<S extends TypeSystemSchemaShape> = {
    [G in GetSemanticTokenGroup<S>]: {
        [V in GetSemanticTokenVariant<S, G>]: readonly GetSemanticMappingTokenRef<GetFlatSchema<S>>[]
    }
};
export type GetGroupedContent<S extends TypeSystemSchemaShape, N extends string> = {
    standalones: StandaloneValues<N>;
    primitive: GetPrimitiveValues<GetFlatSchema<S>>;
    semantic: GetGroupedSemanticMapping<S>;
    component: GetComponentMapping<GetFlatSchema<S>>;
};

function flattenSemanticMapping<S extends TypeSystemSchemaShape>(
    semanticTokens: GetSemanticTokenLookup<S>,
    mapping: GetGroupedSemanticMapping<S>
): GetSemanticMapping<GetFlatSchema<S>> {
    return ObjectStream.of(semanticTokens as { [group: string]: { [variant: string]: string } })
        .flatMap((group, variants) => ObjectStream.of(variants)
            .mapEntries((variant, token) => [
                token, (mapping as { [group: string]: { [variant: string]: readonly unknown[] } })[group][variant]
            ])
        )
        .collect() as GetSemanticMapping<GetFlatSchema<S>>;
}

export class TypeTokenStore<S extends TypeSystemSchemaShape, N extends string> extends CompositeTokenStore<GetFlatSchema<S>, N> {
    constructor(schema: TypeSchema<S>, standalones: readonly N[], content: GetGroupedContent<S, N>) {
        super(schema, standalones, {
            standalones: content.standalones,
            primitive: content.primitive,
            semantic: flattenSemanticMapping(schema.semantic, content.semantic),
            component: content.component
        }, "type");
    }
}
