import type {
    GetContextualToken,
    GetCSSPropertyOf,
    GetPrimitiveTokenLookup,
    GetPrimitiveTokenVariant,
    GetProxyProperty,
    GetSemanticToken,
    GetSemanticTokenGroup,
    GetSemanticTokenLookup,
    GetSemanticTokenVariant,
    SchemaShape
} from "./schema-shape.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import type {CSSValue} from "../types.ts";
import type {GetAliasCustomProperties, GetPrimitiveCustomProperties} from "./css-custom-properties-schema.ts";
import {toVarRefs} from "../utils.ts";

/* Refs: how a higher level points at a lower one. Primitive tokens are referenced by their raw variants per
   proxy property. */
export type GetPrimitiveTokenRef<S extends SchemaShape> = { [P in GetProxyProperty<S>]: GetPrimitiveTokenVariant<S, P> };
export type GetAliasTokenRef<S extends SchemaShape> = {
    tokenRef: GetSemanticToken<S>;
    primitiveOverrides?: Partial<GetPrimitiveTokenRef<S>>;
};

export type GetGroupedSemanticMapping<S extends SchemaShape> = {
    [G in GetSemanticTokenGroup<S>]: { [V in GetSemanticTokenVariant<S, G>]: GetPrimitiveTokenRef<S> }
};
export type GetSemanticMapping<S extends SchemaShape> = { [T in GetSemanticToken<S>]: GetPrimitiveTokenRef<S> };
export type GetContextualMapping<S extends SchemaShape> = { [T in GetContextualToken<S>]: GetAliasTokenRef<S> };

export function getSemanticMappingFlattener<S extends SchemaShape>(semanticTokens: GetSemanticTokenLookup<S>) {
    return (mapping: GetGroupedSemanticMapping<S>) => ObjectStream.of(semanticTokens)
        .flatMap((group, variants) => ObjectStream.of(variants)
            .mapEntries<GetSemanticToken<S>, GetPrimitiveTokenRef<S>>((variant, token) => [
                token, (mapping[group] as Record<string, GetPrimitiveTokenRef<S>>)[variant]
            ])
        )
        .collect() as GetSemanticMapping<S>;
}

type PrimitiveTokenRefResolver<S extends SchemaShape> = (ref: Partial<GetPrimitiveTokenRef<S>>) => {
    [CP in GetCSSPropertyOf<S, GetProxyProperty<S>>]?: CSSValue;
};

// A primitive token's custom properties are optional per CSS property; the ones it has are all set.
export function getPrimitiveTokenRefResolver<S extends SchemaShape>(
    primitiveTokens: GetPrimitiveTokenLookup<S>,
    primitiveCustomProperties: GetPrimitiveCustomProperties<S>
): PrimitiveTokenRefResolver<S> {
    return function (ref) {
        return ObjectStream.of(ref)
        .flatMap((proxyProperty, variant) => {
            const token = primitiveTokens[proxyProperty][variant as GetPrimitiveTokenVariant<S, GetProxyProperty<S>>];
            return toVarRefs(primitiveCustomProperties[token]);
        })
        .collect();
    };
}

type AliasTokenRefResolver<S extends SchemaShape> = (ref: GetAliasTokenRef<S>) => {
    [CP in GetCSSPropertyOf<S, GetProxyProperty<S>>]?: CSSValue;
};

export function getAliasTokenRefResolver<S extends SchemaShape>(
    resolvePrimitiveTokenRef: PrimitiveTokenRefResolver<S>,
    aliasCustomProperties: GetAliasCustomProperties<S>
): AliasTokenRefResolver<S> {
    return function ({tokenRef, primitiveOverrides}) {
        return {
            ...toVarRefs(aliasCustomProperties[tokenRef]),
            ...resolvePrimitiveTokenRef(primitiveOverrides ?? {})
        };
    };
}