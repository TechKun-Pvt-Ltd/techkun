import type {CSSValue, NoReservedRefKeys} from "../types.ts";
import type {GetComponentToken, GetSemanticToken} from "../schema-shape-base.ts";
import type {StandaloneValues} from "../standalones.ts";
import {assertComplete, assertMapped, assertNoCycles} from "../utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {
    CompositeSchema, CompositeSchemaShape, GetComponentMappingTokenRef, GetCSSPropertyOf, GetProxyProperty,
    GetSemanticMappingTokenRef, GetVariantOf
} from "./schema.ts";

/* Entity 3 (composite): every value and mapping, checked against the schema. */

export type GetPrimitiveValue<S extends CompositeSchemaShape, P extends GetProxyProperty<S> = GetProxyProperty<S>> = {
    [CP in GetCSSPropertyOf<S, P>]: CSSValue
};
export type GetPrimitiveValues<S extends CompositeSchemaShape> = {
    [P in GetProxyProperty<S>]: {
        [T in GetVariantOf<S, P>]: GetPrimitiveValue<S, P>;
    };
};
export type GetSemanticMapping<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [ST in GetSemanticToken<S>]: readonly GetSemanticMappingTokenRef<S, A>[];
};
export type GetComponentMapping<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [CT in GetComponentToken<S>]: readonly GetComponentMappingTokenRef<S, A>[];
};

export type CompositeTokenContent<S extends CompositeSchemaShape, N extends string, A extends NoReservedRefKeys<A>> = {
    standalones: StandaloneValues<N>;
    primitive: GetPrimitiveValues<S>;
    semantic: GetSemanticMapping<S, A>;
    component: GetComponentMapping<S, A>;
};

// A primitive ref ends the chain; an alias ref continues it at the token it aliases. Every ref of a token counts,
// whatever its modifiers.
function aliasedTokens(refs: readonly { kind: "primitive" | "alias"; ref: unknown }[]): string[] {
    return refs.flatMap(ref => ref.kind === "alias" ? [ref.ref as string] : []);
}

export class CompositeTokenStore<S extends CompositeSchemaShape, N extends string = never, A extends NoReservedRefKeys<A> = {}> {
    readonly schema: CompositeSchema<S>;
    readonly standalones: StandaloneValues<N>;
    readonly primitive: GetPrimitiveValues<S>;
    readonly semantic: GetSemanticMapping<S, A>;
    readonly component: GetComponentMapping<S, A>;

    constructor(schema: CompositeSchema<S>, standalones: readonly N[], content: CompositeTokenContent<S, N, A>, description: string) {
        this.schema = schema;
        ({standalones: this.standalones, primitive: this.primitive, semantic: this.semantic, component: this.component} = content);

        assertComplete(standalones, this.standalones, `${description} standalone`);
        assertComplete(schema.proxyProperties as string[], this.primitive, `${description} proxy property`);
        for (const proxyProperty of schema.proxyProperties) {
            const values: { [variant: string]: object } = this.primitive[proxyProperty];
            const where = `${description} ${String(proxyProperty)}`;
            assertComplete(schema.variantsOf(proxyProperty), values, `${where} value`);
            for (const [variant, value] of Object.entries(values))
                assertComplete(schema.propertyProxyMap[proxyProperty], value, `${where} ${variant} CSS property`);
        }
        assertComplete(schema.semanticTokens, this.semantic, `${description} semantic mapping`);
        assertComplete(schema.componentTokens, this.component, `${description} component mapping`);
        assertMapped(this.semantic, `${description} semantic token`);
        assertMapped(this.component, `${description} component token`);
        assertNoCycles({
            ...ObjectStream.of(this.semantic).mapValues(aliasedTokens).collect(),
            ...ObjectStream.of(this.component).mapValues(aliasedTokens).collect()
        }, `${description} token reference`);
    }
}
