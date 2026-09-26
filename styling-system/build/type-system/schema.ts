import {
    type GetContextualToken,
    type GetCSSPropertyOf,
    type GetPrimitiveToken,
    getPrimitiveTokenLookup,
    type GetPrimitiveTokenVariant,
    getPropertyProxyMap,
    type GetPropertyProxyMap,
    type GetProxyProperty,
    type GetSemanticToken,
    getSemanticTokenLookup,
    type SchemaShape
} from "../shared/composite-tokens/schema-shape.ts";
import {
    type GetGroupedPrimitiveValues,
    type GetPrimitiveValues,
    getPrimitiveValuesFlattener
} from "../shared/composite-tokens/values-schema.ts";
import {
    type GetAliasTokenRef,
    type GetContextualMapping,
    type GetGroupedSemanticMapping,
    type GetPrimitiveTokenRef,
    getSemanticMappingFlattener
} from "../shared/composite-tokens/mapping-schema.ts";
import {
    type GetAliasCustomProperties,
    getAliasCustomPropertiesBuilder,
    type GetPrimitiveCustomProperties,
    getPrimitiveCustomPropertiesBuilder
} from "../shared/composite-tokens/css-custom-properties-schema.ts";

/* Every token of every level. Primitive tokens are grouped by proxy property - a group of CSS properties
   a token sets together. Semantic tokens are grouped by role. Contextual tokens are a flat list. Semantic and
   contextual tokens set every proxy property. This structure stays internal: it's transformed below into
   the flat token names, lookups for them, and the shapes mappings and values must adhere to. */
const schema = {
    primitive: {
        "type-size": {
            tokens: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
            properties: ["font-size", "line-height", "letter-spacing"]
        },
        weight: {
            tokens: ["regular", "medium", "semibold", "bold"],
            properties: ["font-weight"]
        }
    },
    semantic: {
        display: ["sm"],
        heading: ["sm", "md", "lg", "xl"],
        body: ["sm", "md", "lg"]
    },
    contextual: ["hero-heading", "section-title", "section-subtitle", "item-title", "item-subtitle", "logo-text"]
} as const satisfies SchemaShape;
type Schema = typeof schema;

export type ProxyProperty = GetProxyProperty<Schema>;
export type PrimitiveTokenVariant<P extends ProxyProperty> = GetPrimitiveTokenVariant<Schema, P>;
export type CSSPropertyOf<P extends ProxyProperty> = GetCSSPropertyOf<Schema, P>;
export type CSSProperty = CSSPropertyOf<ProxyProperty>;

export type PrimitiveToken = GetPrimitiveToken<Schema>;
export type SemanticToken = GetSemanticToken<Schema>;
export type ContextualToken = GetContextualToken<Schema>;
export type AliasToken = SemanticToken | ContextualToken;

/* Lookups: the nested structure a level is declared in, with the flat token name at each leaf -
   `semanticTokens.heading.xl` is `"heading-xl"`. */
export const primitiveTokens = getPrimitiveTokenLookup(schema);
export const semanticTokens = getSemanticTokenLookup(schema);

// Flat token names of each level, read off the lookups.
export const primitiveTokensList: PrimitiveToken[] = Object.values(primitiveTokens).flatMap(Object.values);
export const semanticTokensList: SemanticToken[] = Object.values(semanticTokens).flatMap(Object.values);
export const contextualTokensList: ContextualToken[] = [...schema.contextual];

export type PropertyProxyMap = GetPropertyProxyMap<Schema>;
// Proxy property -> the CSS properties it stands in for.
export const propertyProxyMap: PropertyProxyMap = getPropertyProxyMap(schema);


export type GroupedPrimitiveValues = GetGroupedPrimitiveValues<Schema>;
export type PrimitiveValues = GetPrimitiveValues<Schema>;
export const flattenPrimitiveValues = getPrimitiveValuesFlattener(primitiveTokens);


export type PrimitiveTokenRef = GetPrimitiveTokenRef<Schema>;
export type AliasTokenRef = GetAliasTokenRef<Schema>;

export type GroupedSemanticMapping = GetGroupedSemanticMapping<Schema>;
export const flattenSemanticMapping = getSemanticMappingFlattener(semanticTokens);

export type ContextualMapping = GetContextualMapping<Schema>;


export type PrimitiveCustomProperties = GetPrimitiveCustomProperties<Schema>;
export type AliasCustomProperties = GetAliasCustomProperties<Schema>;
export const buildPrimitiveCustomProperties = getPrimitiveCustomPropertiesBuilder(primitiveTokens, propertyProxyMap);
export const buildAliasCustomProperties = getAliasCustomPropertiesBuilder<Schema>(semanticTokensList, contextualTokensList, propertyProxyMap);