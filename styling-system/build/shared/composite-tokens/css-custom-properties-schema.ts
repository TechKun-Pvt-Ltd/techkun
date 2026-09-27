import type {
    GetContextualToken,
    GetCSSPropertyOf,
    GetPrimitiveToken,
    GetPrimitiveTokenLookup,
    GetPrimitiveTokenVariant,
    GetPropertyProxyMap,
    GetProxyProperty,
    GetSemanticToken,
    SchemaShape
} from "./schema-shape.ts";
import type {CSSCustomProperty} from "../types.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import {createObjectFromEntries} from "../utils.ts";

export type GetPrimitiveCustomProperties<S extends SchemaShape> = {
    [T in GetPrimitiveToken<S>]: {
        [CP in GetCSSPropertyOf<S, GetProxyProperty<S>>]?: CSSCustomProperty;
    } & Record<string, CSSCustomProperty>
};

export function getPrimitiveCustomPropertiesBuilder<S extends SchemaShape>(
    primitiveTokens: GetPrimitiveTokenLookup<S>,
    propertyProxyMap: GetPropertyProxyMap<S>
) {
    return (
        naming: (variant: GetPrimitiveTokenVariant<S, GetProxyProperty<S>>, cssProperty: GetCSSPropertyOf<S, GetProxyProperty<S>>) => CSSCustomProperty
    ): GetPrimitiveCustomProperties<S> => ObjectStream.of(primitiveTokens)
    .flatMap((proxyProperty, variants) => ObjectStream.of(variants)
        .mapEntries<
            GetPrimitiveToken<S>, GetPrimitiveCustomProperties<S>[GetPrimitiveToken<S>]
        >((variant, token) => [
            token,
            createObjectFromEntries(propertyProxyMap[proxyProperty].map(cssProperty => [
                cssProperty, naming(variant, cssProperty)
            ]))
        ])
    )
    .collect();
}

export type GetAliasCustomProperties<S extends SchemaShape> = {
    [K in GetSemanticToken<S> | GetContextualToken<S>]: {
        [CP in GetCSSPropertyOf<S, GetProxyProperty<S>>]: CSSCustomProperty;
    }
};

export function getAliasCustomPropertiesBuilder<S extends SchemaShape>(
    semanticTokens: GetSemanticToken<S>[],
    contextualTokens: GetContextualToken<S>[],
    propertyProxyMap: GetPropertyProxyMap<S>
) {
    const cssProperties: GetCSSPropertyOf<S, GetProxyProperty<S>>[] = Object.values(propertyProxyMap).flat();
    return (
        semanticNaming: (token: GetSemanticToken<S>, cssProperty: GetCSSPropertyOf<S, GetProxyProperty<S>>) => CSSCustomProperty,
        contextualNaming: (token: GetContextualToken<S>, cssProperty: GetCSSPropertyOf<S, GetProxyProperty<S>>) => CSSCustomProperty
    ): GetAliasCustomProperties<S> => ({
        ...createObjectFromEntries(semanticTokens.map(token => [
            token,
            createObjectFromEntries(cssProperties.map(cssProperty => [
                cssProperty, semanticNaming(token, cssProperty)
            ]))
        ])),
        ...createObjectFromEntries(contextualTokens.map(token => [
            token,
            createObjectFromEntries(cssProperties.map(cssProperty => [
                cssProperty, contextualNaming(token, cssProperty)
            ]))
        ]))
    });
}