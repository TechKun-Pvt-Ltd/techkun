import type {CSSCustomProperty, CSSValue, NoReservedRefKeys} from "../types.ts";
import type {GetComponentToken, GetSemanticToken, GetTokenRef, SchemaShapeBase} from "../schema-shape-base.ts";
import {toVarRef} from "../utils.ts";

export interface SimpleSchemaShape extends SchemaShapeBase {
    primitive: readonly string[];
}

export type GetPrimitiveToken<S extends SimpleSchemaShape> = S["primitive"][number];

type GetToken<S extends SimpleSchemaShape> = GetPrimitiveToken<S> | GetSemanticToken<S> | GetComponentToken<S>;

export type GetPrimitiveValues<S extends SimpleSchemaShape> = {
    [PT in GetPrimitiveToken<S>]: CSSValue;
};

export type GetCSSCustomProperties<S extends SimpleSchemaShape> = {
    [T in GetToken<S>]: CSSCustomProperty;
};

export type GetSemanticMappingTokenRef<S extends SimpleSchemaShape, A extends NoReservedRefKeys<A> = {}> = GetTokenRef<S, GetPrimitiveToken<S> | GetSemanticToken<S>, A>;
export type GetSemanticMapping<S extends SimpleSchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [ST in GetSemanticToken<S>]: GetSemanticMappingTokenRef<S, A>;
};

export type GetComponentMappingTokenRef<S extends SimpleSchemaShape, A extends NoReservedRefKeys<A> = {}> = GetTokenRef<S, GetToken<S>, A>;
export type GetComponentMapping<S extends SimpleSchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [CT in GetComponentToken<S>]: GetComponentMappingTokenRef<S, A>;
};

export type GetTokenRefResolver<S extends SimpleSchemaShape> = (ref: GetTokenRef<S, GetToken<S>>) => CSSCustomProperty;
export function getTokenRefResolver<S extends SimpleSchemaShape>(cssCustomProperties: GetCSSCustomProperties<S>): GetTokenRefResolver<S> {
    return ({ref}) => cssCustomProperties[ref];
}