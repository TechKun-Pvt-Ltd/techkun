import type {
    CompositeSchemaShape,
    GetCSSPropertyOf,
    GetPropertyProxyMap,
    GetProxyProperty,
    GetVariantOf
} from "../../shared/composite-tokens/schema-shape.ts";
import {getPropertyProxyMap} from "../../shared/composite-tokens/schema-shape.ts";
import type {GetComponentToken, GetSemanticToken} from "../../shared/schema-shape-base.ts";
import {assertUnique, createObjectFromEntries, hyphenJoin, type HyphenJoin} from "../../shared/utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import {spec, type Spec} from "./spec.ts";

type FormatToken<S1 extends string, S2 extends string> = HyphenJoin<S1, S2>;
const formatToken = hyphenJoin;

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
} as const satisfies CompositeSchemaShape;
export type FlatSchema = typeof flatSchema;
// A primitive token is a variant of its proxy property, so its name only has to be unique within that property.
for (const [proxyProperty, {variants}] of Object.entries(flatSchema.primitive))
    assertUnique(variants, `${proxyProperty} token`);
assertUnique([...flatSchema.semantic, ...flatSchema.component], "type alias token");

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
