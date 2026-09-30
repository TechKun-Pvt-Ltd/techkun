import type {CSSCustomProperty, CSSValue, NoReservedRefKeys} from "../types.ts";
import type {GetComponentToken, GetSemanticToken} from "../schema-shape-base.ts";
import {rule, type CSSDeclarations, type CSSRule} from "../css.ts";
import {TokenCSSEmitter, type ContextSelectorNaming, type TokenEmitterConfig} from "../emitter.ts";
import {assertUnique, createObjectFromEntries, toVarRefs} from "../utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import type {CompositeSchemaShape, GetComponentMappingTokenRef, GetProxyProperty, GetVariantOf} from "./schema.ts";
import type {CompositeCustomProperties} from "./custom-properties.ts";
import type {CompositeTokenStore} from "./token-store.ts";

/* Entity 4 (composite). */

// The selector half of a system's naming. A level or proxy property left out gets no utilities.
export interface CompositeSelectorNaming<S extends CompositeSchemaShape> extends ContextSelectorNaming<S> {
    primitiveUtilitySelectors?: { [P in GetProxyProperty<S>]?: (variant: GetVariantOf<S, P>) => string };
    semanticUtilitySelector?(token: GetSemanticToken<S>): string;
    componentUtilitySelector?(token: GetComponentToken<S>): string;
}

type Bundle = { [cssProperty: string]: CSSCustomProperty };

export class CompositeCSSEmitter<S extends CompositeSchemaShape, N extends string = never, A extends NoReservedRefKeys<A> = {}> extends TokenCSSEmitter<S> {
    protected readonly properties: CompositeCustomProperties<S, N>;
    protected readonly tokens: CompositeTokenStore<S, N, A>;
    protected override readonly naming: CompositeSelectorNaming<S>;

    constructor(
        properties: CompositeCustomProperties<S, N>,
        tokens: CompositeTokenStore<S, N, A>,
        naming: CompositeSelectorNaming<S>,
        config: TokenEmitterConfig<S> = {}
    ) {
        super(tokens.schema, tokens.standalones, naming, config);
        this.properties = properties;
        this.tokens = tokens;
        this.naming = naming;
    }

    // Each CSS property of the token's bundle, declared as a reference to whatever the mapping resolves it to.
    #mappingDeclarations(mapping: { [token: string]: GetComponentMappingTokenRef<S, A> }): CSSDeclarations {
        return ObjectStream.of(mapping)
            .flatMap((token, ref) => {
                const values: { [cssProperty: string]: CSSValue } = toVarRefs(this.properties.resolve(ref));
                return ObjectStream.of(this.properties.alias(token as any) as Bundle).mapEntries((cssProperty, customProperty) => {
                    const value = values[cssProperty];
                    if (value === undefined) throw new Error(`No value resolved for ${customProperty}.`);
                    return [customProperty, value];
                });
            })
            .collect();
    }

    protected standaloneProperty(name: string): CSSCustomProperty {
        return this.properties.standalone(name as N);
    }
    // Grouped by CSS property: every font-size, then every line-height, and so on.
    protected primitiveDeclarations(): CSSDeclarations {
        const {schema} = this.tokens;
        return createObjectFromEntries(schema.proxyProperties.flatMap(proxyProperty => {
            const values: { [variant: string]: { [cssProperty: string]: CSSValue } } = this.tokens.primitive[proxyProperty];
            return schema.propertyProxyMap[proxyProperty].flatMap(cssProperty => schema.variantsOf(proxyProperty).map(variant => [
                (this.properties.primitive(proxyProperty, variant) as Bundle)[cssProperty],
                values[variant][cssProperty]
            ] as const));
        }));
    }
    protected semanticDeclarations(): CSSDeclarations {
        return this.#mappingDeclarations(this.tokens.semantic);
    }
    protected componentDeclarations(): CSSDeclarations {
        return this.#mappingDeclarations(this.tokens.component);
    }

    utilities(): CSSRule[] {
        const {schema} = this.tokens;
        const {primitiveUtilitySelectors = {}, semanticUtilitySelector, componentUtilitySelector} = this.naming;
        const rules = [
            ...schema.proxyProperties.flatMap(proxyProperty => {
                const selector = (primitiveUtilitySelectors as { [proxyProperty: PropertyKey]: ((variant: string) => string) | undefined })[proxyProperty];
                return selector === undefined ? [] : schema.variantsOf(proxyProperty)
                    .map(variant => rule(selector(variant), toVarRefs(this.properties.primitive(proxyProperty, variant))));
            }),
            ...(semanticUtilitySelector ? schema.semanticTokens.map(token => rule(semanticUtilitySelector(token), toVarRefs(this.properties.alias(token)))) : []),
            ...(componentUtilitySelector ? schema.componentTokens.map(token => rule(componentUtilitySelector(token), toVarRefs(this.properties.alias(token)))) : [])
        ];
        assertUnique(rules.map(({selector}) => selector), "utility selector");
        return rules;
    }
}
