import type {CSSCustomProperty, CSSValue, NoReservedRefKeys} from "../types.ts";
import type {GetAliasToken, GetComponentToken, GetSemanticToken, GetTokenRef, SchemaShapeBase} from "../schema-shape-base.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";

// ========== Composite Tokens ==========
export interface CompositeSchemaShape extends SchemaShapeBase {
    primitive: {
        [proxyProperty: string]: {
            variants: readonly string[];
            properties: readonly string[];
        }
    };
}
export type GetProxyProperty<S extends CompositeSchemaShape> = keyof S["primitive"];
export type GetVariantOf<S extends CompositeSchemaShape, P extends GetProxyProperty<S>> = ElementOf<S["primitive"][P]["variants"]>;
export type GetCSSPropertyOf<S extends CompositeSchemaShape, P extends GetProxyProperty<S>> = ElementOf<S["primitive"][P]["properties"]>;

export type GetPrimitiveToken<S extends CompositeSchemaShape> = {
    [P in GetProxyProperty<S>]: GetVariantOf<S, P>;
};

export type GetPropertyProxyMap<S extends CompositeSchemaShape> = { [P in GetProxyProperty<S>]: GetCSSPropertyOf<S, P>[]; };
export function getPropertyProxyMap<S extends CompositeSchemaShape>(schema: S) {
    return ObjectStream.of(schema.primitive)
        .mapValues(value => value.properties)
        .collect() as GetPropertyProxyMap<S>;
}

export type GetPrimitiveValue<S extends CompositeSchemaShape, P extends GetProxyProperty<S> = GetProxyProperty<S>> = {
    [CP in GetCSSPropertyOf<S, P>]: CSSValue
};
export type GetPrimitiveValues<S extends CompositeSchemaShape> = {
    [P in GetProxyProperty<S>]: {
        [T in GetVariantOf<S, P>]: GetPrimitiveValue<S, P>;
    };
};

export type GetCSSCustomPropertiesBundle<S extends CompositeSchemaShape, P extends GetProxyProperty<S> = GetProxyProperty<S>> = {
    [CP in GetCSSPropertyOf<S, P>]: CSSCustomProperty
};
export type GetPrimitiveCSSCustomProperties<S extends CompositeSchemaShape> = {
    [P in GetProxyProperty<S>]: {
        [T in GetVariantOf<S, P>]: GetCSSCustomPropertiesBundle<S, P>;
    };
};
export type GetAliasCSSCustomProperties<S extends CompositeSchemaShape> = {
    [T in GetAliasToken<S>]: GetCSSCustomPropertiesBundle<S>;
};

export type GetPrimitiveTokenRef<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> =
    GetTokenRef<S, GetPrimitiveToken<S>, A & { kind: "primitive" }>;
export type GetAliasTokenRef<S extends CompositeSchemaShape, T extends GetAliasToken<S> = GetAliasToken<S>, A extends NoReservedRefKeys<A> = {}> =
    GetTokenRef<S, T, A & { kind: "alias", override?: Partial<GetPrimitiveToken<S>>; }>;

export type GetSemanticMappingTokenRef<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> =
    | GetPrimitiveTokenRef<S>
    | GetAliasTokenRef<S, GetSemanticToken<S>, A>;
export type GetSemanticMapping<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [ST in GetSemanticToken<S>]: GetSemanticMappingTokenRef<S, A>;
};

export type GetComponentMappingTokenRef<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> =
    | GetPrimitiveTokenRef<S>
    | GetAliasTokenRef<S, GetAliasToken<S>, A>;
export type GetComponentMapping<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [CT in GetComponentToken<S>]: GetComponentMappingTokenRef<S, A>;
};

export type GetTokenRefResolver<S extends CompositeSchemaShape> = (ref: GetComponentMappingTokenRef<S>) => GetCSSCustomPropertiesBundle<S>;
export function getTokenRefResolver<S extends CompositeSchemaShape>(
    primitiveCustomProperties: GetPrimitiveCSSCustomProperties<S>,
    aliasCustomProperties: GetAliasCSSCustomProperties<S>,
): GetTokenRefResolver<S> {
    function flatMapper<P extends GetProxyProperty<S>>(proxyProperty: P, variant: GetVariantOf<S, P> | undefined): GetCSSCustomPropertiesBundle<S, P> {
        return variant ? primitiveCustomProperties[proxyProperty][variant] : ({} as any);
    }
    function resolvePrimitiveTokenRef(token: Partial<GetPrimitiveToken<S>>) {
        return ObjectStream.of(token)
        .flatMap(flatMapper)
        .collect();
    }
    return function (ref) {
        return ref.kind === "primitive" ?
            resolvePrimitiveTokenRef(ref.ref) :
            { ...aliasCustomProperties[ref.ref], ...(ref.override ? resolvePrimitiveTokenRef(ref.override) : null) }
    }
}

type ElementOf<A extends readonly any[]> = A extends readonly any[] ? A[number] : never;
