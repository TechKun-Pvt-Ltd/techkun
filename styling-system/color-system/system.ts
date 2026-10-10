import {SimpleSchema, type GetComponentMappingTokenRef, type GetSemanticMappingTokenRef} from "../shared/simple-tokens/schema.ts";
import {SimpleTokenStore, type GetComponentMapping, type GetPrimitiveValues, type GetSemanticMapping} from "../shared/simple-tokens/token-store.ts";
import {SimpleCSSEmitter} from "../shared/simple-tokens/emitter.ts";
import type {StandaloneValues} from "../shared/standalones.ts";
import type {CSSValue} from "../shared/types.ts";
import {createObjectFromEntries, hyphenJoin, type HyphenJoin} from "../shared/utils.ts";
import {ObjectStream} from "../../lib/object-stream.ts";

/* The color system's own entities, and the one place its nested structures (the spec, grouped content) are
   transformed into the flat structures the shared entities work with. */

// Targets: the part of a token's name that says which CSS property it colors.
export const TARGETS = ["bg", "text", "border", "fill", "stroke"] as const;
export type Target = typeof TARGETS[number];
// Target -> the CSS property it colors.
const TARGET_PROPERTIES = {
    bg: "background-color",
    text: "color",
    border: "border-color",
    fill: "fill",
    stroke: "stroke"
} as const satisfies { [T in Target]: string };

function isTarget(group: PropertyKey): group is Target {
    return (TARGETS as readonly PropertyKey[]).includes(group);
}

// ========== Spec ==========

/* The structure every color spec declares its tokens in. Primitive tokens are grouped by ramp, semantic tokens by
   group (a target, or a group without one), and component tokens list the targets they color. */
export type ColorSystemSchemaShape = {
    primitive: { [group: string]: readonly string[] };
    semantic: { [G in Target]?: readonly string[] } & { [group: string]: readonly string[] };
    component: { [component: string]: readonly Target[] };
    themes: readonly ("light" | "dark")[];
};

// ========== Lookups ==========

/* The nested structure a level is declared in, with the flat token name at each leaf -
   `colorSchema.semantic.bg.canvas` is `"bg-canvas"`, `colorSchema.component["btn-primary"].bg` is `"bg-btn-primary"`. */

type Leaf<L> = { [K in keyof L]: L[K][keyof L[K]] }[keyof L];
type ElementOf<A> = A extends readonly (infer E extends string)[] ? E : never;

export type GetRampKey<S extends ColorSystemSchemaShape> = keyof S["primitive"] & string;
export type GetStepOf<S extends ColorSystemSchemaShape, R extends GetRampKey<S>> = ElementOf<S["primitive"][R]>;
type GetPrimitiveTokenLookup<S extends ColorSystemSchemaShape> = { [R in GetRampKey<S>]: { [St in GetStepOf<S, R>]: HyphenJoin<R, St> } };

export type GetSemanticTokenGroup<S extends ColorSystemSchemaShape> = keyof S["semantic"] & string;
export type GetSemanticTokenVariant<S extends ColorSystemSchemaShape, G extends GetSemanticTokenGroup<S>> = ElementOf<S["semantic"][G]>;
type GetSemanticTokenLookup<S extends ColorSystemSchemaShape> = { [G in GetSemanticTokenGroup<S>]: { [V in GetSemanticTokenVariant<S, G>]: HyphenJoin<G, V> } };

export type GetComponent<S extends ColorSystemSchemaShape> = keyof S["component"] & string;
export type GetComponentTokenVariant<S extends ColorSystemSchemaShape, C extends GetComponent<S>> = ElementOf<S["component"][C]>;
type GetComponentTokenLookup<S extends ColorSystemSchemaShape> = { [C in GetComponent<S>]: { [T in GetComponentTokenVariant<S, C>]: HyphenJoin<T, C> } };

export type GetTheme<S extends ColorSystemSchemaShape> = S["themes"][number];

function lookupOf<L>(groups: { [group: string]: readonly string[] }, join: (group: string, variant: string) => string): L {
    return ObjectStream.of(groups)
        .mapEntryToValue((group, variants) => createObjectFromEntries(variants.map(variant => [variant, join(group as string, variant)] as const)))
        .collect() as L;
}
function leavesOf<L extends object>(lookup: L): Leaf<L>[] {
    return Object.values(lookup).flatMap(variants => Object.values(variants));
}

// ========== Schema ==========

type GetAliasToken<S extends ColorSystemSchemaShape> = Leaf<GetSemanticTokenLookup<S>> | Leaf<GetComponentTokenLookup<S>>;
export type GetFlatSchema<S extends ColorSystemSchemaShape> = {
    primitive: readonly Leaf<GetPrimitiveTokenLookup<S>>[];
    semantic: readonly Leaf<GetSemanticTokenLookup<S>>[];
    component: readonly Leaf<GetComponentTokenLookup<S>>[];
    properties: { [T in GetAliasToken<S>]?: typeof TARGET_PROPERTIES[Target] };
    modifiers: { theme: S["themes"] };
};

export class ColorSchema<S extends ColorSystemSchemaShape> extends SimpleSchema<GetFlatSchema<S>> {
    readonly primitive: GetPrimitiveTokenLookup<S>;
    readonly semantic: GetSemanticTokenLookup<S>;
    readonly component: GetComponentTokenLookup<S>;

    constructor(spec: S) {
        const primitive = lookupOf<GetPrimitiveTokenLookup<S>>(spec.primitive, hyphenJoin);
        const semantic = lookupOf<GetSemanticTokenLookup<S>>(spec.semantic, hyphenJoin);
        const component = lookupOf<GetComponentTokenLookup<S>>(spec.component, (component, target) => hyphenJoin(target, component));
        super({
            primitive: leavesOf(primitive),
            semantic: leavesOf(semantic),
            component: leavesOf(component),
            // A token's target is the group it's declared in (semantic) or the target it's declared as (component).
            // Tokens without a target (brand) affect no property.
            properties: {
                ...ObjectStream.of(semantic as { [group: string]: { [variant: string]: string } })
                    .flatMap((group, variants) => isTarget(group)
                        ? ObjectStream.of(variants).mapEntries((_, token) => [token, TARGET_PROPERTIES[group]])
                        : {})
                    .collect(),
                ...ObjectStream.of(component as { [component: string]: { [target: string]: string } })
                    .flatMap((_, tokens) => ObjectStream.of(tokens).mapEntries((target, token) => [token, TARGET_PROPERTIES[target as Target]]))
                    .collect()
            } as GetFlatSchema<S>["properties"],
            modifiers: {theme: spec.themes}
        }, "color token");
        this.primitive = primitive;
        this.semantic = semantic;
        this.component = component;
    }
}

// ========== Content ==========

export type Adjustments = { alpha?: number; };
// A mapped token points at one lower-level color, optionally at a reduced alpha.
export type GetColorSemanticMappingTokenRef<S extends ColorSystemSchemaShape> = GetSemanticMappingTokenRef<GetFlatSchema<S>, Adjustments>;
export type GetColorComponentMappingTokenRef<S extends ColorSystemSchemaShape> = GetComponentMappingTokenRef<GetFlatSchema<S>, Adjustments>;

export type GetGroupedPrimitiveValues<S extends ColorSystemSchemaShape> = {
    [R in GetRampKey<S>]: {
        [St in GetStepOf<S, R>]: CSSValue
    }
};
// Every theme maps the same semantic tokens.
export type GetGroupedSemanticMapping<S extends ColorSystemSchemaShape> = {
    [Th in GetTheme<S>]: {
        [G in GetSemanticTokenGroup<S>]: {
            [V in GetSemanticTokenVariant<S, G>]: GetColorSemanticMappingTokenRef<S>
        }
    };
};
export type GetGroupedComponentMapping<S extends ColorSystemSchemaShape> = {
    [C in GetComponent<S>]: {
        [V in GetComponentTokenVariant<S, C>]: GetColorComponentMappingTokenRef<S>
    };
};
export type GetGroupedContent<S extends ColorSystemSchemaShape, N extends string> = {
    seeds: StandaloneValues<N>;
    primitive: GetGroupedPrimitiveValues<S>;
    semantic: GetGroupedSemanticMapping<S>;
    component: GetGroupedComponentMapping<S>;
};

// Re-keys each leaf of the grouped content by the flat token the lookup names it.
function flattenByLookup(lookup: object, grouped: object) {
    return ObjectStream.of(lookup as { [group: string]: { [variant: string]: string } })
        .flatMap((group, tokens) => ObjectStream.of(tokens)
            .mapEntries((variant, token) => [token, (grouped as { [group: string]: { [variant: string]: unknown } })[group]?.[variant]])
        )
        .collect();
}

// Every theme's ref for a token, each under that theme.
function flattenSemanticMapping<S extends ColorSystemSchemaShape>(
    semanticTokens: GetSemanticTokenLookup<S>,
    mapping: GetGroupedSemanticMapping<S>
): GetSemanticMapping<GetFlatSchema<S>, Adjustments> {
    const flat: { [T in Leaf<GetSemanticTokenLookup<S>>]?: GetColorSemanticMappingTokenRef<S>[] } = {};
    for (const [theme, themeMapping] of Object.entries(mapping) as [GetTheme<S>, GetGroupedSemanticMapping<S>[GetTheme<S>]][]) {
        const themeRefs = flattenByLookup(semanticTokens, themeMapping) as { [T in Leaf<GetSemanticTokenLookup<S>>]?: GetColorSemanticMappingTokenRef<S> };
        for (const [token, ref] of Object.entries(themeRefs) as [Leaf<GetSemanticTokenLookup<S>>, GetColorSemanticMappingTokenRef<S> | undefined][])
            if (ref !== undefined) (flat[token] ??= []).push({...ref, modifiers: {...ref.modifiers, theme}});
    }
    return flat as GetSemanticMapping<GetFlatSchema<S>, Adjustments>;
}

// A component token has the one ref it's declared with, under every theme.
function flattenComponentMapping<S extends ColorSystemSchemaShape>(
    componentTokens: GetComponentTokenLookup<S>,
    mapping: GetGroupedComponentMapping<S>
): GetComponentMapping<GetFlatSchema<S>, Adjustments> {
    const refs = flattenByLookup(componentTokens, mapping) as { [T in Leaf<GetComponentTokenLookup<S>>]?: GetColorComponentMappingTokenRef<S> };
    return ObjectStream.of(refs).mapValues(ref => ref === undefined ? undefined : [ref]).collect() as GetComponentMapping<GetFlatSchema<S>, Adjustments>;
}

export class ColorTokenStore<S extends ColorSystemSchemaShape, N extends string> extends SimpleTokenStore<GetFlatSchema<S>, N, Adjustments> {
    constructor(schema: ColorSchema<S>, seeds: readonly N[], content: GetGroupedContent<S, N>) {
        super(schema, seeds, {
            standalones: content.seeds,
            primitive: flattenByLookup(schema.primitive, content.primitive) as GetPrimitiveValues<GetFlatSchema<S>>,
            semantic: flattenSemanticMapping(schema.semantic, content.semantic),
            component: flattenComponentMapping(schema.component, content.component)
        }, "color");
    }
}

// ========== CSS ==========

export class ColorCSSEmitter<S extends ColorSystemSchemaShape, N extends string> extends SimpleCSSEmitter<GetFlatSchema<S>, N, Adjustments> {
    protected override resolveRefValue(ref: GetColorComponentMappingTokenRef<S>): CSSValue {
        const value = super.resolveRefValue(ref);
        return ref.alpha === undefined ? value : `oklch(from ${value} l c h / ${ref.alpha})`;
    }
}
