import type {
    GetComponentToken,
    GetCSSPropertyOf,
    GetPropertyProxyMap,
    GetProxyProperty,
    GetSemanticToken,
    GetVariantOf,
    SchemaShape
} from "../../shared/composite-tokens/schema-shape.ts";
import {getPropertyProxyMap} from "../../shared/composite-tokens/schema-shape.ts";
import {createObjectFromEntries} from "../../shared/utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import {spec, type Spec} from "./spec.ts";

type FormatToken<S1 extends string, S2 extends string> = `${S1}-${S2}`;
function formatToken<S1 extends string, S2 extends string>(string1: S1, string2: S2): FormatToken<S1, S2> {
    return `${string1}-${string2}`;
}

/* Lookups: the nested structure a level is declared in, with the flat token name at each leaf -
   `semanticTokens.heading.xl` is `"heading-xl"`. */

export type SemanticTokenGroup = keyof Spec["semantic"];
export type SemanticTokenVariant<G extends SemanticTokenGroup> = Spec["semantic"][G][number];
type SemanticTokenLookup = {
    [G in SemanticTokenGroup]: {
        [V in SemanticTokenVariant<G>]: FormatToken<G & string, V>;
    }
};
export const semanticTokens = ObjectStream.of(spec.semantic)
    .mapEntryToValue((group, variants) => createObjectFromEntries(
        variants.map(variant => [variant, formatToken(group, variant)] as const)
    ))
    .collect() as SemanticTokenLookup;

const flatSchema = {
    primitive: spec.primitive,
    semantic: Object.values(semanticTokens).flatMap(variants => Object.values(variants)),
    component: spec.component
} as const satisfies SchemaShape;
export type FlatSchema = typeof flatSchema;

export type ProxyProperty = GetProxyProperty<FlatSchema>;
export type PrimitiveTokenVariant<P extends ProxyProperty> = GetVariantOf<FlatSchema, P>;
export type CSSPropertyOf<P extends ProxyProperty> = GetCSSPropertyOf<FlatSchema, P>;
export type CSSProperty = CSSPropertyOf<ProxyProperty>;

export type SemanticToken = GetSemanticToken<FlatSchema>;
export const semanticTokensList: SemanticToken[] = flatSchema.semantic;

export type ComponentToken = GetComponentToken<FlatSchema>;
export const componentTokensList: ComponentToken[] = [...flatSchema.component];

export type AliasToken = SemanticToken | ComponentToken;

export type PropertyProxyMap = GetPropertyProxyMap<FlatSchema>;
// Proxy property -> the CSS properties it stands in for.
export const propertyProxyMap: PropertyProxyMap = getPropertyProxyMap(flatSchema);
