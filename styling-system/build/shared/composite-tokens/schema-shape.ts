import type {CSSCustomProperty, CSSValue, NoReservedRefKeys} from "../types.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";

// ========== Composite Tokens ==========
export type SchemaShape = {
    primitive: {
        [proxyProperty: string]: {
            variants: readonly string[];
            properties: readonly string[];
        }
    };
    semantic: readonly string[];
    component?: readonly string[];
    modifiers?: {
        [modifier: string]: readonly string[];
    };
};
export type GetProxyProperty<S extends SchemaShape> = keyof S["primitive"];
export type GetVariantOf<S extends SchemaShape, P extends GetProxyProperty<S>> = ElementOf<S["primitive"][P]["variants"]>;
export type GetCSSPropertyOf<S extends SchemaShape, P extends GetProxyProperty<S>> = ElementOf<S["primitive"][P]["properties"]>;

export type GetPrimitiveToken<S extends SchemaShape> = {
    [P in GetProxyProperty<S>]: GetVariantOf<S, P>;
};
// function getPrimitiveTokens<S extends SchemaShape>(schema: S) {
//     return ObjectStream.of(schema.primitive)
//         .mapValues(value => value.variants)
//         .collect() as GetPrimitiveToken<S>;
// }
export type GetSemanticToken<S extends SchemaShape> = S["semantic"][number];
export type GetComponentToken<S extends SchemaShape> = S["component"] extends readonly string[] ? S["component"][number] : never;
export type GetAliasToken<S extends SchemaShape> = GetSemanticToken<S> | GetComponentToken<S>;

export type GetPropertyProxyMap<S extends SchemaShape> = { [P in GetProxyProperty<S>]: GetCSSPropertyOf<S, P>[]; };
export function getPropertyProxyMap<S extends SchemaShape>(schema: S) {
    return ObjectStream.of(schema.primitive)
        .mapValues(value => value.properties)
        .collect() as GetPropertyProxyMap<S>;
}

export type GetPrimitiveValue<S extends SchemaShape, P extends GetProxyProperty<S> = GetProxyProperty<S>> = {
    [CP in GetCSSPropertyOf<S, P>]: CSSValue
};
export type GetPrimitiveValues<S extends SchemaShape> = {
    [P in GetProxyProperty<S>]: {
        [T in GetVariantOf<S, P>]: GetPrimitiveValue<S, P>;
    };
};

export type GetCSSCustomPropertiesBundle<S extends SchemaShape, P extends GetProxyProperty<S> = GetProxyProperty<S>> = {
    [CP in GetCSSPropertyOf<S, P>]: CSSCustomProperty
};
export type GetPrimitiveCSSCustomProperties<S extends SchemaShape> = {
    [P in GetProxyProperty<S>]: {
        [T in GetVariantOf<S, P>]: GetCSSCustomPropertiesBundle<S, P>;
    };
};
export type GetAliasCSSCustomProperties<S extends SchemaShape> = {
    [T in GetAliasToken<S>]: GetCSSCustomPropertiesBundle<S>;
};

type GetModifier<S extends SchemaShape> = S["modifiers"] extends {} ? keyof S["modifiers"] : never;
type GetModifierContext<S extends SchemaShape, M extends GetModifier<S>> = S["modifiers"] extends {} ? S["modifiers"][M][number] : never;
export type GetModifiersRef<S extends SchemaShape> = {
    [M in GetModifier<S>]: GetModifierContext<S, M>;
};
type GetTokenRef<S extends SchemaShape, T extends GetPrimitiveToken<S> | GetAliasToken<S>, A extends NoReservedRefKeys<A> = {}> = {
    ref: T;
    modifiers?: GetModifiersRef<S>;
} & A;

export type GetPrimitiveTokenRef<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> =
    GetTokenRef<S, GetPrimitiveToken<S>, A & { kind: "primitive" }>;
export type GetAliasTokenRef<S extends SchemaShape, T extends GetAliasToken<S> = GetAliasToken<S>, A extends NoReservedRefKeys<A> = {}> =
    GetTokenRef<S, T, A & { kind: "alias", override?: Partial<GetPrimitiveToken<S>>; }>;

export type GetSemanticMappingTokenRef<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> =
    | GetPrimitiveTokenRef<S>
    | GetAliasTokenRef<S, GetSemanticToken<S>, A>;
export type GetSemanticMapping<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [ST in GetSemanticToken<S>]: GetSemanticMappingTokenRef<S, A>;
};

export type GetComponentMappingTokenRef<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> =
    | GetPrimitiveTokenRef<S>
    | GetAliasTokenRef<S, GetAliasToken<S>, A>;
export type GetComponentMapping<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [CT in GetComponentToken<S>]: GetComponentMappingTokenRef<S, A>;
};

// export type GetPrimitiveTokenRefResolver<S extends SchemaShape> = (ref: GetPrimitiveTokenRef<S>["ref"]) => GetCSSCustomPropertiesBundle<S>;
// export function getPrimitiveTokenRefResolver<S extends SchemaShape>(primitiveCustomProperties: GetPrimitiveCSSCustomProperties<S>): GetPrimitiveTokenRefResolver<S> {
//     function flatMapper<P extends GetProxyProperty<S>>(proxyProperty: P, variant: GetVariantOf<S, P>): GetCSSCustomPropertiesBundle<S, P> {
//         return primitiveCustomProperties[proxyProperty][variant];
//     }
//     return function (ref) {
//         return ObjectStream.of(ref)
//             .flatMap(flatMapper)
//             .collect();
//     }
// }
//
// export type GetAliasTokenRefResolver<S extends SchemaShape> = (ref: GetAliasTokenRef<S>["ref"], override?: GetAliasTokenRef<S>["override"]) => GetCSSCustomPropertiesBundle<S>;
// export function getAliasTokenRefResolver<S extends SchemaShape>(
//     primitiveCustomProperties: GetPrimitiveCSSCustomProperties<S>,
//     aliasCustomProperties: GetAliasCSSCustomProperties<S>,
// ): GetAliasTokenRefResolver<S> {
//     function flatMapper<P extends GetProxyProperty<S>>(proxyProperty: P, variant: GetVariantOf<S, P> | undefined): GetCSSCustomPropertiesBundle<S, P> {
//         return variant ? primitiveCustomProperties[proxyProperty][variant] : ({} as any);
//     }
//     return function (ref, override) {
//         return {
//             ...aliasCustomProperties[ref],
//             ...(override ? ObjectStream.of(override)
//                 .flatMap(flatMapper)
//                 .collect() : null)
//         };
//     }
// }

export type GetTokenRefResolver<S extends SchemaShape> = (ref: GetComponentMappingTokenRef<S>) => GetCSSCustomPropertiesBundle<S>;
export function getTokenRefResolver<S extends SchemaShape>(
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
