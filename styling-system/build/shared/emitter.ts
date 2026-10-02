import type {CSSCustomProperty, CSSValue} from "./types.ts";
import type {GetModifiersRef, SchemaShapeBase} from "./schema-shape-base.ts";
import type {StandaloneValue} from "./standalones.ts";
import {propertyRegistration, rule, type CSSAtRule, type CSSDeclarations, type CSSNode, type CSSRule} from "./css.ts";
import {mergeAll} from "./utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

/* Entity 4, the part both families share: where standalones, primitives and alias tokens are declared.
   Emits rules and at-rules only; which layer they land in is the stylesheet's call. */

// The selector half of a system's naming. Each family extends it with its utility selectors.
export interface SelectorNaming {
    rootSelector?: string;
}

// A value and the modifier contexts it applies in. Without modifiers, it's the default.
export type GetConditionalValue<S extends SchemaShapeBase> = {
    modifiers?: GetModifiersRef<S>;
    value: CSSValue;
};
// An alias custom property and a value for each of its refs.
export type GetAliasCSSCustomPropertyValues<S extends SchemaShapeBase> = {
    property: CSSCustomProperty;
    values: readonly GetConditionalValue<S>[];
};

/* How a system translates modifiers into CSS. It sees every value of a custom property at once, whichever
   modifiers their conditions name. */
export interface ModifierStrategy<S extends SchemaShapeBase> {
    // One custom property's values -> the values to declare, each under the condition it's declared in.
    combine(values: readonly GetConditionalValue<S>[]): readonly GetConditionalValue<S>[];
    // The rules one condition's declarations go into.
    rules(modifiers: GetModifiersRef<S>, declarations: CSSDeclarations): CSSNode[];
    // Declarations that go on the root rule without being tokens.
    rootDeclarations?(): CSSDeclarations;
}

type MapFromObject<O extends object> = Map<keyof O, O[keyof O]>;
function namedModifiers<S extends SchemaShapeBase>(modifiers: GetModifiersRef<S> | undefined): MapFromObject<GetModifiersRef<S>> {
    return new Map(
        Object.entries(modifiers ?? {})
        .filter(([, context]) => context !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
    ) as any;
}

export abstract class TokenCSSEmitter<S extends SchemaShapeBase> {
    protected readonly standalones: { readonly [name: string]: StandaloneValue };
    protected readonly naming: SelectorNaming;
    protected readonly strategy: ModifierStrategy<S> | undefined;

    protected constructor(
        standalones: { readonly [name: string]: StandaloneValue },
        naming: SelectorNaming,
        strategy: ModifierStrategy<S> | undefined
    ) {
        this.standalones = standalones;
        this.naming = naming;
        this.strategy = strategy;
    }

    protected abstract standaloneProperty(name: string): CSSCustomProperty;
    protected abstract primitiveDeclarations(): CSSDeclarations;
    // Semantic, then component.
    protected abstract aliasPropertyValues(): GetAliasCSSCustomPropertyValues<S>[];
    abstract utilities(): CSSRule[];

    registrations(): CSSAtRule[] {
        return Object.entries(this.standalones).flatMap(([name, {registration}]) =>
            registration === undefined ? [] : [propertyRegistration(this.standaloneProperty(name), registration)]
        );
    }

    // Defaults go on the root rule. Every other condition gets the strategy's rules, ordered by how many
    // modifiers it names, so a more specific condition comes later and wins a tie in specificity.
    declarations(): CSSNode[] {
        const standalones: CSSDeclarations = ObjectStream.of(this.standalones)
            .mapEntries((name, {value}) => [this.standaloneProperty(name as string), value])
            .collect();
        type Declarations = Map<CSSCustomProperty, CSSValue>;
        type Modifiers = MapFromObject<GetModifiersRef<S>>;
        const defaults: Declarations = new Map();
        const conditions = new Map<Modifiers, Declarations>();

        for (const {property, values} of this.aliasPropertyValues()) {
            const declared = this.strategy?.combine(values) ?? values;
            const seen = new Set<Modifiers>();
            for (const {modifiers, value} of declared) {
                const named = namedModifiers<S>(modifiers);
                if (seen.has(named))
                    throw new Error(`${property} has more than one value for the condition ${JSON.stringify(named)}.`);
                seen.add(named);

                if (modifiers === undefined) {
                    defaults.set(property, value);
                    continue;
                }
                if (this.strategy === undefined)
                    throw new Error(`${property} has a value under modifiers, but the system has no modifier strategy.`);

                if (!conditions.has(named))
                    conditions.set(named, new Map());

                conditions.get(named)!.set(property, value);
            }
        }

        const root = rule(
            this.naming.rootSelector ?? ":root",
            mergeAll([this.strategy?.rootDeclarations?.() ?? null, standalones, this.primitiveDeclarations(), Object.fromEntries(defaults)])
        );
        return [
            root,
            ...conditions.entries().toArray()
                .sort(([a], [b]) => a.size - b.size)
                // Conditions are only collected with a strategy.
                .flatMap(([modifiers, declarations]) => this.strategy!.rules(
                    Object.fromEntries(modifiers) as GetModifiersRef<S>,
                    Object.fromEntries(declarations)
                ))
        ];
    }
}
