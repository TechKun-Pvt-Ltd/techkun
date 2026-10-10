import type {CSSCustomProperty, CSSValue, NoReservedRefKeys} from "../types.ts";
import type {GetComponentToken, GetSemanticToken} from "../schema-shape-base.ts";
import {rule, type CSSDeclarations, type CSSRule} from "../css.ts";
import {TokenCSSEmitter, type GetAliasCSSCustomPropertyValues, type ModifierStrategy, type SelectorNaming} from "../emitter.ts";
import {assertUnique, createObjectFromEntries, toVarRefs} from "../utils.ts";
import type {CompositeSchemaShape, GetComponentMappingTokenRef, GetProxyProperty, GetVariantOf} from "./schema.ts";
import type {CompositeCustomProperties} from "./custom-properties.ts";
import type {CompositeTokenStore} from "./token-store.ts";

/* Entity 4 (composite). */

// The selector half of a system's naming. A level or proxy property left out gets no utilities.
export interface CompositeSelectorNaming<S extends CompositeSchemaShape> extends SelectorNaming {
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
        strategy?: ModifierStrategy<S>
    ) {
        super(tokens.standalones, naming, strategy);
        this.properties = properties;
        this.tokens = tokens;
        this.naming = naming;
    }

    // Each CSS property of the token's bundle, with a value for each ref: a reference to whatever the ref resolves it to.
    #mappingPropertyValues(mapping: { [token: string]: readonly GetComponentMappingTokenRef<S, A>[] }): GetAliasCSSCustomPropertyValues<S>[] {
        return Object.entries(mapping).flatMap(([token, refs]) => {
            const resolved = refs.map(ref => ({modifiers: ref.modifiers, values: toVarRefs(this.properties.resolve(ref)) as { [cssProperty: string]: CSSValue }}));
            return Object.entries(this.properties.alias(token as any) as Bundle).map(([cssProperty, customProperty]) => ({
                property: customProperty,
                values: resolved.map(({modifiers, values}) => {
                    const value = values[cssProperty];
                    if (value === undefined) throw new Error(`No value resolved for ${customProperty}.`);
                    return {modifiers, value};
                })
            }));
        });
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
    protected aliasPropertyValues(): GetAliasCSSCustomPropertyValues<S>[] {
        return [...this.#mappingPropertyValues(this.tokens.semantic), ...this.#mappingPropertyValues(this.tokens.component)];
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
