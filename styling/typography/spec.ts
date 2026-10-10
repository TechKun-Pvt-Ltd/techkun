import type {
    GetAliasTokenRef, GetCSSPropertyOf, GetPrimitiveTokenRef, GetProxyProperty, GetVariantOf
} from "../../styling-system/shared/composite-tokens/schema.ts";
import type {GetComponentMapping, GetPrimitiveValues} from "../../styling-system/shared/composite-tokens/token-store.ts";
import type {GetAliasToken, GetComponentToken, GetSemanticToken} from "../../styling-system/shared/schema-shape-base.ts";
import {
    TypeSchema, type GetFlatSchema, type GetGroupedSemanticMapping, type TypeSystemSchemaShape
} from "../../styling-system/type-system/system.ts";

/* Every token of every level. Primitive tokens are grouped by proxy property - a group of CSS properties
   a token sets together. Semantic tokens are grouped by role. Component tokens are a flat list. Semantic and
   component tokens set every proxy property. This structure stays internal: TypeSchema transforms it into the
   flat schema and the lookups for it. */
const spec = {
    primitive: {
        "type-size": {
            variants: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
            properties: ["font-size", "line-height", "letter-spacing"]
        },
        weight: {
            variants: ["regular", "medium", "semibold", "bold"],
            properties: ["font-weight"]
        }
    },
    semantic: {
        display: ["sm"],
        heading: ["sm", "md", "lg", "xl"],
        body: ["sm", "md", "lg"]
    },
    component: ["hero-heading", "section-title", "section-subtitle", "item-title", "item-subtitle", "logo-text"]
} as const satisfies TypeSystemSchemaShape;
export type Spec = typeof spec;

export type FlatSchema = GetFlatSchema<Spec>;
export type ProxyProperty = GetProxyProperty<FlatSchema>;
export type PrimitiveTokenVariant<P extends ProxyProperty> = GetVariantOf<FlatSchema, P>;
export type CSSPropertyOf<P extends ProxyProperty> = GetCSSPropertyOf<FlatSchema, P>;
export type SemanticToken = GetSemanticToken<FlatSchema>;
export type ComponentToken = GetComponentToken<FlatSchema>;
export type PrimitiveValues = GetPrimitiveValues<FlatSchema>;
export type PrimitiveTokenRef = GetPrimitiveTokenRef<FlatSchema>;
export type AliasTokenRef<T extends GetAliasToken<FlatSchema> = GetAliasToken<FlatSchema>> = GetAliasTokenRef<FlatSchema, T>;
export type ComponentMapping = GetComponentMapping<FlatSchema>;
export type GroupedSemanticMapping = GetGroupedSemanticMapping<Spec>;

export const typeSchema = new TypeSchema(spec);
