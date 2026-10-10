import type {CSSCustomProperty, CSSValue, NoReservedRefKeys} from "../types.ts";
import type {GetAliasToken} from "../schema-shape-base.ts";
import {rule, type CSSDeclarations, type CSSRule} from "../css.ts";
import {TokenCSSEmitter, type GetAliasCSSCustomPropertyValues, type ModifierStrategy, type SelectorNaming} from "../emitter.ts";
import {assertUnique, toVarRef} from "../utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {GetComponentMappingTokenRef, SimpleSchemaShape} from "./schema.ts";
import type {SimpleCustomProperties} from "./custom-properties.ts";
import type {SimpleTokenStore} from "./token-store.ts";

/* Entity 4 (simple). */

// The selector half of a system's naming. Only alias tokens that affect a CSS property get a utility.
export interface SimpleSelectorNaming<S extends SimpleSchemaShape> extends SelectorNaming {
    utilitySelector?(token: GetAliasToken<S>): string;
}

export class SimpleCSSEmitter<S extends SimpleSchemaShape, N extends string = never, A extends NoReservedRefKeys<A> = {}> extends TokenCSSEmitter<S> {
    protected readonly properties: SimpleCustomProperties<S, N>;
    protected readonly tokens: SimpleTokenStore<S, N, A>;
    protected override readonly naming: SimpleSelectorNaming<S>;

    constructor(
        properties: SimpleCustomProperties<S, N>,
        tokens: SimpleTokenStore<S, N, A>,
        naming: SimpleSelectorNaming<S>,
        strategy?: ModifierStrategy<S>
    ) {
        super(tokens.standalones, naming, strategy);
        this.properties = properties;
        this.tokens = tokens;
        this.naming = naming;
    }

    // Extension point: a system with adjustments (a color's alpha) turns the plain reference into its value here.
    protected resolveRefValue(ref: GetComponentMappingTokenRef<S, A>): CSSValue {
        return toVarRef(this.properties.resolve(ref));
    }

    #mappingPropertyValues(mapping: { [token: string]: readonly GetComponentMappingTokenRef<S, A>[] }): GetAliasCSSCustomPropertyValues<S>[] {
        return Object.entries(mapping).map(([token, refs]) => ({
            property: this.properties.of(token as GetAliasToken<S>),
            values: refs.map(ref => ({modifiers: ref.modifiers, value: this.resolveRefValue(ref)}))
        }));
    }

    protected standaloneProperty(name: string): CSSCustomProperty {
        return this.properties.standalone(name as N);
    }
    protected primitiveDeclarations(): CSSDeclarations {
        return ObjectStream.of(this.tokens.primitive).mapKeys(token => this.properties.of(token)).collect();
    }
    protected aliasPropertyValues(): GetAliasCSSCustomPropertyValues<S>[] {
        return [...this.#mappingPropertyValues(this.tokens.semantic), ...this.#mappingPropertyValues(this.tokens.component)];
    }

    utilities(): CSSRule[] {
        const {utilitySelector} = this.naming;
        if (utilitySelector === undefined) return [];
        const rules = this.tokens.schema.aliasTokens.flatMap(token => {
            const property = this.tokens.schema.propertyOf(token);
            return property === undefined ? [] : [rule(utilitySelector(token), {[property]: this.properties.var(token)})];
        });
        assertUnique(rules.map(({selector}) => selector), "utility selector");
        return rules;
    }
}
