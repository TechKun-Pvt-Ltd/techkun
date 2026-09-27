import type {
    GetComponentMapping, GetComponentMappingTokenRef,
    GetCSSCustomProperties, GetPrimitiveValues,
    GetSemanticMapping, GetSemanticMappingTokenRef
} from "../../shared/simple-tokens/schema-shape.ts";
import {createObjectFromEntries} from "../../shared/utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import type {CSSCustomProperty, CSSValue} from "../../shared/types.ts";
import {
    componentTokens, componentTokensList, primitiveTokens, primitiveTokensList, semanticTokens, semanticTokensList
} from "./lookups.ts";
import type {
    AliasToken, Component, ComponentTokenVariant, FlatSchema, PrimitiveToken, RampKey,
    SemanticTokenGroup, SemanticTokenVariant, StepOf, Theme
} from "./lookups.ts";

// ========== Values ==========

export type GroupedPrimitiveValues = {
    [R in RampKey]: {
        [S in StepOf<R>]: CSSValue
    }
};
export type PrimitiveValues = GetPrimitiveValues<FlatSchema>;
export function flattenPrimitiveValues(values: GroupedPrimitiveValues) {
    return ObjectStream.of(primitiveTokens)
        .flatMap((rampKey, steps) => ObjectStream.of(steps)
            .mapEntries((variant, token) => [
                token, values[rampKey][variant]
            ])
        )
        .collect() as PrimitiveValues;
}

// ========== Custom Properties ==========

export type CSSCustomProperties = GetCSSCustomProperties<FlatSchema>;
export function buildCssCustomProperties(naming: (token: PrimitiveToken | AliasToken) => CSSCustomProperty): CSSCustomProperties {
    return createObjectFromEntries(
        [...primitiveTokensList, ...semanticTokensList, ...componentTokensList].map(token => [token, naming(token)] as const)
    );
}

// ========== Mapping ==========

// Every theme maps the same semantic tokens.
export type GroupedSemanticMapping = {
    [Th in Theme]: {
        [G in SemanticTokenGroup]: {
            [V in SemanticTokenVariant<G>]: SemanticMappingTokenRef
        }
    };
};

// Only the nested shape: how component tokens are named, and so the flat shape, is up to the implementation.
export type GroupedComponentMapping = {
    [C in Component]: {
        [V in ComponentTokenVariant<C>]: ComponentMappingTokenRef
    };
};

type Adjustments = { alpha?: number; };
// A mapped token points at one lower-level color, optionally at a reduced alpha.
export type SemanticMappingTokenRef = GetSemanticMappingTokenRef<FlatSchema, Adjustments>;
export type SemanticMapping = GetSemanticMapping<FlatSchema, Adjustments>;
export function flattenSemanticMapping(mapping: GroupedSemanticMapping): SemanticMapping {
    return ObjectStream.of(mapping)
        .flatMap((theme, themeMapping) => ObjectStream.of(semanticTokens)
            .flatMap((group, variants) => {
                const themeMappingElement = themeMapping[group] as Record<SemanticTokenVariant<SemanticTokenGroup>, SemanticMappingTokenRef>;
                return ObjectStream.of(variants)
                    .mapEntries((variant, token) => {
                        const mappingTokenRef = themeMappingElement[variant];
                        return [
                            token,
                            {...mappingTokenRef, modifiers: {...mappingTokenRef.modifiers, theme}}
                        ] as const;
                    });
            })
        )
        .collect();
}

export type ComponentMappingTokenRef = GetComponentMappingTokenRef<FlatSchema, Adjustments>;
export type ComponentMapping = GetComponentMapping<FlatSchema, Adjustments>;
export function flattenComponentMapping(mapping: GroupedComponentMapping): ComponentMapping {
    return ObjectStream.of(componentTokens)
        .flatMap((component, tokens) => ObjectStream.of(tokens)
            .mapEntries((target, flatToken) => [
                flatToken, (mapping[component] as Record<string, ComponentMappingTokenRef>)[target]
            ])
        )
        .collect();
}
