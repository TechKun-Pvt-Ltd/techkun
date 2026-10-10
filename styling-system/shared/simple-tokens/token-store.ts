import type {CSSValue, NoReservedRefKeys} from "../types.ts";
import type {GetComponentToken, GetSemanticToken} from "../schema-shape-base.ts";
import type {StandaloneValues} from "../standalones.ts";
import {assertComplete, assertMapped, assertNoCycles} from "../utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {
    GetComponentMappingTokenRef, GetPrimitiveToken, GetSemanticMappingTokenRef, SimpleSchema, SimpleSchemaShape
} from "./schema.ts";

/* Entity 3 (simple): every value and mapping, checked against the schema. */

export type GetPrimitiveValues<S extends SimpleSchemaShape> = {
    [PT in GetPrimitiveToken<S>]: CSSValue;
};
export type GetSemanticMapping<S extends SimpleSchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [ST in GetSemanticToken<S>]: readonly GetSemanticMappingTokenRef<S, A>[];
};
export type GetComponentMapping<S extends SimpleSchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [CT in GetComponentToken<S>]: readonly GetComponentMappingTokenRef<S, A>[];
};

export type SimpleTokenContent<S extends SimpleSchemaShape, N extends string, A extends NoReservedRefKeys<A>> = {
    standalones: StandaloneValues<N>;
    primitive: GetPrimitiveValues<S>;
    semantic: GetSemanticMapping<S, A>;
    component: GetComponentMapping<S, A>;
};

export class SimpleTokenStore<S extends SimpleSchemaShape, N extends string = never, A extends NoReservedRefKeys<A> = {}> {
    readonly schema: SimpleSchema<S>;
    readonly standalones: StandaloneValues<N>;
    readonly primitive: GetPrimitiveValues<S>;
    readonly semantic: GetSemanticMapping<S, A>;
    readonly component: GetComponentMapping<S, A>;

    constructor(schema: SimpleSchema<S>, standalones: readonly N[], content: SimpleTokenContent<S, N, A>, description: string) {
        this.schema = schema;
        ({standalones: this.standalones, primitive: this.primitive, semantic: this.semantic, component: this.component} = content);

        assertComplete(standalones, this.standalones, `${description} standalone`);
        assertComplete(schema.primitiveTokens, this.primitive, `${description} primitive value`);
        assertComplete(schema.semanticTokens, this.semantic, `${description} semantic mapping`);
        assertComplete(schema.componentTokens, this.component, `${description} component mapping`);
        assertMapped(this.semantic, `${description} semantic token`);
        assertMapped(this.component, `${description} component token`);
        // Primitive tokens aren't mapped, so a ref to one ends the chain. Every ref of a token counts, whatever
        // its modifiers.
        assertNoCycles({
            ...ObjectStream.of(this.semantic).mapValues(refs => refs.map(({ref}) => ref as string)).collect(),
            ...ObjectStream.of(this.component).mapValues(refs => refs.map(({ref}) => ref as string)).collect()
        }, `${description} token reference`);
    }
}
