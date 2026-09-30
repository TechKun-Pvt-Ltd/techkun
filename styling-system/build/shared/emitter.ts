import type {CSSCustomProperty} from "./types.ts";
import type {GetModifiersRef, Schema, SchemaShapeBase} from "./schema-shape-base.ts";
import type {StandaloneValue} from "./standalones.ts";
import {propertyRegistration, rule, type CSSAtRule, type CSSDeclarations, type CSSRule} from "./css.ts";
import {mergeAll} from "./utils.ts";

/* Entity 4, the part both families share: where standalones, primitives and alias tokens are declared.
   Emits rules and at-rules only; which layer they land in is the stylesheet's call. */

// The selector half of a system's naming. Each family extends it with its utility selectors.
export interface ContextSelectorNaming<S extends SchemaShapeBase> {
    rootSelector?: string;
    // Required when the schema has modifiers.
    contextSelector?(context: GetModifiersRef<S>): string;
}

export type TokenEmitterConfig<S extends SchemaShapeBase> = {
    // Declarations that aren't tokens but go along with a modifier context (`color-scheme` for a theme).
    contextDeclarations?(context: GetModifiersRef<S>): CSSDeclarations;
};

export abstract class TokenCSSEmitter<S extends SchemaShapeBase> {
    protected readonly schema: Schema<S>;
    protected readonly standalones: { readonly [name: string]: StandaloneValue };
    protected readonly naming: ContextSelectorNaming<S>;
    protected readonly config: TokenEmitterConfig<S>;

    protected constructor(
        schema: Schema<S>,
        standalones: { readonly [name: string]: StandaloneValue },
        naming: ContextSelectorNaming<S>,
        config: TokenEmitterConfig<S>
    ) {
        this.schema = schema;
        this.standalones = standalones;
        this.naming = naming;
        this.config = config;
    }

    protected abstract standaloneProperty(name: string): CSSCustomProperty;
    protected abstract primitiveDeclarations(): CSSDeclarations;
    protected abstract semanticDeclarations(): CSSDeclarations;
    protected abstract componentDeclarations(): CSSDeclarations;
    abstract utilities(): CSSRule[];

    registrations(): CSSAtRule[] {
        return Object.entries(this.standalones).flatMap(([name, {registration}]) =>
            registration === undefined ? [] : [propertyRegistration(this.standaloneProperty(name), registration)]);
    }

    declarations(): CSSRule[] {
        const standalones: CSSDeclarations = Object.fromEntries(
            Object.entries(this.standalones).map(([name, {value}]) => [this.standaloneProperty(name), value]));
        const primitives = this.primitiveDeclarations();
        const semantic = this.semanticDeclarations();
        const component = this.componentDeclarations();
        const root = this.naming.rootSelector ?? ":root";

        const contexts = this.schema.modifierContexts;
        if (contexts.length === 0)
            return [rule(root, mergeAll([standalones, primitives, semantic, component]))];

        const {contextSelector} = this.naming;
        if (contextSelector === undefined) throw new Error("A schema with modifiers needs a context selector.");
        return [
            rule(root, mergeAll([standalones, primitives, component])),
            ...contexts.map(context => rule(
                contextSelector(context),
                mergeAll([this.config.contextDeclarations?.(context) ?? null, semantic])
            ))
        ];
    }
}
