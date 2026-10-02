import {
    CompositeSchema, type GetAliasTokenRef, type GetCSSPropertyOf, type GetPrimitiveTokenRef, type GetProxyProperty,
    type GetSemanticMappingTokenRef, type GetVariantOf
} from "../shared/composite-tokens/schema.ts";
import {
    CompositeTokenStore, type GetComponentMapping, type GetPrimitiveValues, type GetSemanticMapping
} from "../shared/composite-tokens/token-store.ts";
import type {GetAliasToken, GetComponentToken, GetSemanticToken} from "../shared/schema-shape-base.ts";
import type {StandaloneValues} from "../shared/standalones.ts";
import {createObjectFromEntries, hyphenJoin, type HyphenJoin} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {Spec} from "./spec.ts";
import type {Standalone} from "./custom-properties.ts";

/* The type system's own entities, and the one place its nested structures (the spec, grouped content) are
   transformed into the flat structures the shared entities work with. Primitive and component tokens are
   already flat; only semantic tokens are grouped. */

// ========== Lookups ==========

/* `typeSchema.semantic.heading.xl` is `"heading-xl"`. */

export type SemanticTokenGroup = keyof Spec["semantic"];
export type SemanticTokenVariant<G extends SemanticTokenGroup> = Spec["semantic"][G][number];
type SemanticTokenLookup = { [G in SemanticTokenGroup]: { [V in SemanticTokenVariant<G>]: HyphenJoin<G, V> } };
type Leaf<L> = { [K in keyof L]: L[K][keyof L[K]] }[keyof L];

// ========== Schema ==========

export type FlatSchema = {
    primitive: Spec["primitive"];
    semantic: readonly Leaf<SemanticTokenLookup>[];
    component: Spec["component"];
};

export type ProxyProperty = GetProxyProperty<FlatSchema>;
export type PrimitiveTokenVariant<P extends ProxyProperty> = GetVariantOf<FlatSchema, P>;
export type CSSPropertyOf<P extends ProxyProperty> = GetCSSPropertyOf<FlatSchema, P>;
export type SemanticToken = GetSemanticToken<FlatSchema>;
export type ComponentToken = GetComponentToken<FlatSchema>;

export class TypeSchema extends CompositeSchema<FlatSchema> {
    readonly semantic: SemanticTokenLookup;

    constructor(spec: Spec) {
        const semantic = ObjectStream.of(spec.semantic)
            .mapEntryToValue((group, variants) => createObjectFromEntries(variants.map(variant => [variant, hyphenJoin(group, variant)] as const)))
            .collect() as SemanticTokenLookup;
        super({
            primitive: spec.primitive,
            semantic: Object.values(semantic).flatMap(variants => Object.values(variants)) as Leaf<SemanticTokenLookup>[],
            component: spec.component
        }, "type");
        this.semantic = semantic;
    }
}

// ========== Content ==========

export type PrimitiveValues = GetPrimitiveValues<FlatSchema>;

export type PrimitiveTokenRef = GetPrimitiveTokenRef<FlatSchema>;
export type AliasTokenRef<T extends GetAliasToken<FlatSchema> = GetAliasToken<FlatSchema>> = GetAliasTokenRef<FlatSchema, T>;
export type SemanticMappingTokenRef = GetSemanticMappingTokenRef<FlatSchema>;
export type ComponentMapping = GetComponentMapping<FlatSchema>;

export type GroupedSemanticMapping = {
    [G in SemanticTokenGroup]: {
        [V in SemanticTokenVariant<G>]: readonly SemanticMappingTokenRef[]
    }
};
export type GroupedContent = {
    standalones: StandaloneValues<Standalone>;
    primitive: PrimitiveValues;
    semantic: GroupedSemanticMapping;
    component: ComponentMapping;
};

function flattenSemanticMapping(semanticTokens: SemanticTokenLookup, mapping: GroupedSemanticMapping): GetSemanticMapping<FlatSchema> {
    return ObjectStream.of(semanticTokens)
        .flatMap((group, variants) => ObjectStream.of(variants)
            .mapEntries((variant, token) => [
                token, (mapping[group] as Record<string, readonly SemanticMappingTokenRef[]>)[variant]
            ])
        )
        .collect() as GetSemanticMapping<FlatSchema>;
}

export class TypeTokenStore extends CompositeTokenStore<FlatSchema, Standalone> {
    constructor(schema: TypeSchema, standalones: readonly Standalone[], content: GroupedContent) {
        super(schema, standalones, {
            standalones: content.standalones,
            primitive: content.primitive,
            semantic: flattenSemanticMapping(schema.semantic, content.semantic),
            component: content.component
        }, "type");
    }
}
