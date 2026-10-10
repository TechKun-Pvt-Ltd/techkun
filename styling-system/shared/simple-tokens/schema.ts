import type {NoReservedRefKeys} from "../types.ts";
import {
    Schema, type GetAliasToken, type GetComponentToken, type GetSemanticToken, type GetTokenRef, type SchemaShapeBase
} from "../schema-shape-base.ts";
import {assertUnique} from "../utils.ts";

/* Entity 1 (simple): the validated flat schema. Every token holds a single value. */

export interface SimpleSchemaShape extends SchemaShapeBase {
    primitive: readonly string[];
    // The one CSS property an alias token affects, if any. Primitives are raw values, so they affect none.
    properties?: { readonly [aliasToken: string]: string | undefined };
}

export type GetPrimitiveToken<S extends SimpleSchemaShape> = S["primitive"][number];
export type GetToken<S extends SimpleSchemaShape> = GetPrimitiveToken<S> | GetSemanticToken<S> | GetComponentToken<S>;

export type GetSemanticMappingTokenRef<S extends SimpleSchemaShape, A extends NoReservedRefKeys<A> = {}> = GetTokenRef<S, GetPrimitiveToken<S> | GetSemanticToken<S>, A>;
export type GetComponentMappingTokenRef<S extends SimpleSchemaShape, A extends NoReservedRefKeys<A> = {}> = GetTokenRef<S, GetToken<S>, A>;

export class SimpleSchema<S extends SimpleSchemaShape> extends Schema<S> {
    constructor(shape: S, description: string) {
        super(shape);
        assertUnique(this.tokens, description);
        const aliasTokens = new Set<string>(this.aliasTokens);
        for (const token of Object.keys(shape.properties ?? {}))
            if (!aliasTokens.has(token)) throw new Error(`Only alias tokens affect a CSS property, not ${description} "${token}".`);
    }

    get primitiveTokens(): GetPrimitiveToken<S>[] {
        return [...this.shape.primitive];
    }
    get tokens(): GetToken<S>[] {
        return [...this.primitiveTokens, ...this.aliasTokens];
    }
    propertyOf(token: GetAliasToken<S>): string | undefined {
        return this.shape.properties?.[token];
    }
}
