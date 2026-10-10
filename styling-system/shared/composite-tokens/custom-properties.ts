import type {CSSCustomProperty, CSSValue} from "../types.ts";
import type {GetAliasToken, GetComponentToken, GetSemanticToken} from "../schema-shape-base.ts";
import {assertUnique, createObjectFromEntries, toVarRef, toVarRefs} from "../utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {
    CompositeSchema, CompositeSchemaShape, GetComponentMappingTokenRef, GetCSSPropertyOf, GetPrimitiveToken,
    GetProxyProperty, GetVariantOf
} from "./schema.ts";

/* Entity 2 (composite): the CSS custom property each token sets each of its CSS properties through. A primitive
   token sets only its proxy property's CSS properties; alias tokens set them all. */

type CSSProperty<S extends CompositeSchemaShape> = GetCSSPropertyOf<S, GetProxyProperty<S>>;

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

// The custom-property half of a system's naming.
export interface CompositeCustomPropertyNaming<S extends CompositeSchemaShape, N extends string> {
    standalone(name: N): CSSCustomProperty;
    primitive(variant: GetVariantOf<S, GetProxyProperty<S>>, cssProperty: CSSProperty<S>): CSSCustomProperty;
    semantic(token: GetSemanticToken<S>, cssProperty: CSSProperty<S>): CSSCustomProperty;
    component(token: GetComponentToken<S>, cssProperty: CSSProperty<S>): CSSCustomProperty;
}

export type GetTokenRefResolver<S extends CompositeSchemaShape> = (ref: GetComponentMappingTokenRef<S>) => GetCSSCustomPropertiesBundle<S>;

export class CompositeCustomProperties<S extends CompositeSchemaShape, N extends string = never> {
    readonly schema: CompositeSchema<S>;
    readonly #standalones: { [K in N]: CSSCustomProperty };
    readonly #primitive: GetPrimitiveCSSCustomProperties<S>;
    readonly #alias: GetAliasCSSCustomProperties<S>;

    constructor(schema: CompositeSchema<S>, standalones: readonly N[], naming: CompositeCustomPropertyNaming<S, N>) {
        this.schema = schema;
        this.#standalones = createObjectFromEntries(standalones.map(name => [name, naming.standalone(name)] as const));
        this.#primitive = ObjectStream.of(schema.propertyProxyMap)
            .mapEntryToValue((proxyProperty, cssProperties) => createObjectFromEntries(
                schema.variantsOf(proxyProperty).map(variant => [
                    variant,
                    createObjectFromEntries(cssProperties.map(cssProperty => [cssProperty, naming.primitive(variant, cssProperty)] as const))
                ] as const)
            ))
            .collect() as GetPrimitiveCSSCustomProperties<S>;
        const bundle = <T>(token: T, name: (token: T, cssProperty: CSSProperty<S>) => CSSCustomProperty) =>
            [token, createObjectFromEntries(schema.cssProperties.map(cssProperty => [cssProperty, name(token, cssProperty)] as const))] as const;
        this.#alias = createObjectFromEntries([
            ...schema.semanticTokens.map(token => bundle(token, naming.semantic)),
            ...schema.componentTokens.map(token => bundle(token, naming.component))
        ]) as GetAliasCSSCustomProperties<S>;

        // Distinct names can still be named alike; one declaration would then silently replace the other.
        assertUnique([
            ...Object.values<CSSCustomProperty>(this.#standalones),
            ...Object.values<{ [variant: string]: { [cssProperty: string]: CSSCustomProperty } }>(this.#primitive)
                .flatMap(variants => Object.values(variants).flatMap(bundle => Object.values(bundle))),
            ...Object.values<{ [cssProperty: string]: CSSCustomProperty }>(this.#alias).flatMap(bundle => Object.values(bundle))
        ], "custom property");
    }

    standalone(name: N): CSSCustomProperty {
        return this.#standalones[name];
    }
    standaloneVar(name: N): CSSValue {
        return toVarRef(this.standalone(name));
    }
    primitive<P extends GetProxyProperty<S>>(proxyProperty: P, variant: GetVariantOf<S, P>): GetCSSCustomPropertiesBundle<S, P> {
        return this.#primitive[proxyProperty][variant];
    }
    primitiveVars<P extends GetProxyProperty<S>>(proxyProperty: P, variant: GetVariantOf<S, P>) {
        return toVarRefs(this.primitive(proxyProperty, variant));
    }
    alias(token: GetAliasToken<S>): GetCSSCustomPropertiesBundle<S> {
        return this.#alias[token];
    }

    #resolvePrimitiveTokenRef(token: Partial<GetPrimitiveToken<S>>) {
        return ObjectStream.of(token)
            .flatMap((proxyProperty, variant) => variant ? this.#primitive[proxyProperty][variant] : ({} as any))
            .collect();
    }

    readonly resolve: GetTokenRefResolver<S> = ref => ref.kind === "primitive" ?
        this.#resolvePrimitiveTokenRef(ref.ref) :
        {...this.#alias[ref.ref], ...(ref.override ? this.#resolvePrimitiveTokenRef(ref.override) : null)};
}
