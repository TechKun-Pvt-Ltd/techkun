import type {
    GetAliasCSSCustomProperties,
    GetAliasTokenRef,
    GetComponentMapping,
    GetPrimitiveCSSCustomProperties,
    GetPrimitiveTokenRef,
    GetPrimitiveValues,
    GetSemanticMapping
} from "../../shared/composite-tokens/schema-shape.ts";
import {createObjectFromEntries} from "../../shared/utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import type {CSSCustomProperty} from "../../shared/types.ts";
import {componentTokensList, propertyProxyMap, semanticTokens, semanticTokensList} from "./lookups.ts";
import type {
    AliasToken, ComponentToken, CSSProperty, FlatSchema, PrimitiveTokenVariant, ProxyProperty,
    SemanticToken, SemanticTokenGroup, SemanticTokenVariant
} from "./lookups.ts";
import {spec} from "./spec.ts";

// ========== Values ==========

export type PrimitiveValues = GetPrimitiveValues<FlatSchema>;

// ========== Custom Properties ==========

export type PrimitiveCustomProperties = GetPrimitiveCSSCustomProperties<FlatSchema>;
export function buildPrimitiveCustomProperties(
    naming: (variant: PrimitiveTokenVariant<ProxyProperty>, cssProperty: CSSProperty) => CSSCustomProperty
): PrimitiveCustomProperties {
    return ObjectStream.of(spec.primitive)
        .mapValues(({variants, properties}) => createObjectFromEntries(
            variants.map(variant => [
                variant,
                createObjectFromEntries(properties.map(cssProperty => [cssProperty, naming(variant, cssProperty)] as const))
            ] as const)
        ))
        .collect() as PrimitiveCustomProperties;
}

export type AliasCustomProperties = GetAliasCSSCustomProperties<FlatSchema>;
export function buildAliasCustomProperties(
    semanticNaming: (token: SemanticToken, cssProperty: CSSProperty) => CSSCustomProperty,
    componentNaming: (token: ComponentToken, cssProperty: CSSProperty) => CSSCustomProperty
): AliasCustomProperties {
    const cssProperties: CSSProperty[] = Object.values(propertyProxyMap).flat();
    function build<T extends AliasToken>(tokens: T[], naming: (token: T, cssProperty: CSSProperty) => CSSCustomProperty) {
        return createObjectFromEntries(tokens.map(token => [
            token,
            createObjectFromEntries(cssProperties.map(cssProperty => [cssProperty, naming(token, cssProperty)] as const))
        ] as const));
    }
    return {
        ...build(semanticTokensList, semanticNaming),
        ...build(componentTokensList, componentNaming)
    };
}

// ========== Mapping ==========

export type PrimitiveTokenRef = GetPrimitiveTokenRef<FlatSchema>;
export type AliasTokenRef = GetAliasTokenRef<FlatSchema>;

export type SemanticMapping = GetSemanticMapping<FlatSchema>;
export type SemanticMappingTokenRef = SemanticMapping[SemanticToken];
export type GroupedSemanticMapping = {
    [G in SemanticTokenGroup]: {
        [V in SemanticTokenVariant<G>]: SemanticMappingTokenRef
    }
};
export function flattenSemanticMapping(mapping: GroupedSemanticMapping): SemanticMapping {
    return ObjectStream.of(semanticTokens)
        .flatMap((group, variants) => ObjectStream.of(variants)
            .mapEntries((variant, token) => [
                token, (mapping[group] as Record<string, SemanticMappingTokenRef>)[variant]
            ])
        )
        .collect() as SemanticMapping;
}

export type ComponentMapping = GetComponentMapping<FlatSchema>;
export type ComponentMappingTokenRef = ComponentMapping[ComponentToken];
