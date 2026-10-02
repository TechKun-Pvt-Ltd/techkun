import {SimpleSchema, type GetComponentMappingTokenRef, type GetSemanticMappingTokenRef} from "../shared/simple-tokens/schema.ts";
import {SimpleTokenStore, type GetComponentMapping, type GetPrimitiveValues, type GetSemanticMapping} from "../shared/simple-tokens/token-store.ts";
import {SimpleCSSEmitter} from "../shared/simple-tokens/emitter.ts";
import type {StandaloneValues} from "../shared/standalones.ts";
import type {CSSValue} from "../shared/types.ts";
import {createObjectFromEntries, hyphenJoin, type HyphenJoin} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {Spec} from "./spec.ts";
import type {Seed} from "./custom-properties.ts";

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

function isTarget(group: string): group is Target {
    return (TARGETS as readonly string[]).includes(group);
}

// ========== Lookups ==========

/* The nested structure a level is declared in, with the flat token name at each leaf -
   `colorSchema.semantic.bg.canvas` is `"bg-canvas"`, `colorSchema.component["btn-primary"].bg` is `"bg-btn-primary"`. */

type Leaf<L> = { [K in keyof L]: L[K][keyof L[K]] }[keyof L];

export type RampKey = keyof Spec["primitive"];
export type StepOf<R extends RampKey> = Spec["primitive"][R][number];
type PrimitiveTokenLookup = { [R in RampKey]: { [S in StepOf<R>]: HyphenJoin<R, S> } };

export type SemanticTokenGroup = keyof Spec["semantic"];
export type SemanticTokenVariant<G extends SemanticTokenGroup> = Spec["semantic"][G][number];
type SemanticTokenLookup = { [G in SemanticTokenGroup]: { [V in SemanticTokenVariant<G>]: HyphenJoin<G, V> } };

export type Component = keyof Spec["component"];
export type ComponentTokenVariant<C extends Component> = Spec["component"][C][number];
type ComponentTokenLookup = { [C in Component]: { [T in ComponentTokenVariant<C>]: HyphenJoin<T, C> } };

export type Theme = Spec["themes"][number];

function lookupOf<L>(groups: { [group: string]: readonly string[] }, join: (group: string, variant: string) => string): L {
    return ObjectStream.of(groups)
        .mapEntryToValue((group, variants) => createObjectFromEntries(variants.map(variant => [variant, join(group as string, variant)] as const)))
        .collect() as L;
}
function leavesOf<L extends object>(lookup: L): Leaf<L>[] {
    return Object.values(lookup).flatMap(variants => Object.values(variants));
}

// ========== Schema ==========

type AliasToken = Leaf<SemanticTokenLookup> | Leaf<ComponentTokenLookup>;
export type FlatSchema = {
    primitive: readonly Leaf<PrimitiveTokenLookup>[];
    semantic: readonly Leaf<SemanticTokenLookup>[];
    component: readonly Leaf<ComponentTokenLookup>[];
    properties: { [T in AliasToken]?: typeof TARGET_PROPERTIES[Target] };
    modifiers: { theme: Spec["themes"] };
};

export class ColorSchema extends SimpleSchema<FlatSchema> {
    readonly primitive: PrimitiveTokenLookup;
    readonly semantic: SemanticTokenLookup;
    readonly component: ComponentTokenLookup;

    constructor(spec: Spec) {
        const primitive = lookupOf<PrimitiveTokenLookup>(spec.primitive, hyphenJoin);
        const semantic = lookupOf<SemanticTokenLookup>(spec.semantic, hyphenJoin);
        const component = lookupOf<ComponentTokenLookup>(spec.component, (component, target) => hyphenJoin(target, component));
        super({
            primitive: leavesOf(primitive),
            semantic: leavesOf(semantic),
            component: leavesOf(component),
            // A token's target is the group it's declared in (semantic) or the target it's declared as (component).
            // Tokens without a target (brand) affect no property.
            properties: {
                ...ObjectStream.of(semantic)
                    .flatMap((group, variants) => isTarget(group)
                        ? ObjectStream.of(variants).mapEntries((_, token) => [token, TARGET_PROPERTIES[group]])
                        : {})
                    .collect(),
                ...ObjectStream.of(component)
                    .flatMap((_, tokens) => ObjectStream.of(tokens).mapEntries((target, token) => [token, TARGET_PROPERTIES[target]]))
                    .collect()
            },
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
export type SemanticMappingTokenRef = GetSemanticMappingTokenRef<FlatSchema, Adjustments>;
export type ComponentMappingTokenRef = GetComponentMappingTokenRef<FlatSchema, Adjustments>;

export type GroupedPrimitiveValues = {
    [R in RampKey]: {
        [S in StepOf<R>]: CSSValue
    }
};
// Every theme maps the same semantic tokens.
export type GroupedSemanticMapping = {
    [Th in Theme]: {
        [G in SemanticTokenGroup]: {
            [V in SemanticTokenVariant<G>]: SemanticMappingTokenRef
        }
    };
};
export type GroupedComponentMapping = {
    [C in Component]: {
        [V in ComponentTokenVariant<C>]: ComponentMappingTokenRef
    };
};
export type GroupedContent = {
    seeds: StandaloneValues<Seed>;
    primitive: GroupedPrimitiveValues;
    semantic: GroupedSemanticMapping;
    component: GroupedComponentMapping;
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
function flattenSemanticMapping(semanticTokens: SemanticTokenLookup, mapping: GroupedSemanticMapping): GetSemanticMapping<FlatSchema, Adjustments> {
    const flat: { [T in Leaf<SemanticTokenLookup>]?: SemanticMappingTokenRef[] } = {};
    for (const [theme, themeMapping] of Object.entries(mapping) as [Theme, GroupedSemanticMapping[Theme]][]) {
        const themeRefs = flattenByLookup(semanticTokens, themeMapping) as { [T in Leaf<SemanticTokenLookup>]?: SemanticMappingTokenRef };
        for (const [token, ref] of Object.entries(themeRefs) as [Leaf<SemanticTokenLookup>, SemanticMappingTokenRef | undefined][])
            if (ref !== undefined) (flat[token] ??= []).push({...ref, modifiers: {...ref.modifiers, theme}});
    }
    return flat as GetSemanticMapping<FlatSchema, Adjustments>;
}

// A component token has the one ref it's declared with, under every theme.
function flattenComponentMapping(componentTokens: ComponentTokenLookup, mapping: GroupedComponentMapping): GetComponentMapping<FlatSchema, Adjustments> {
    const refs = flattenByLookup(componentTokens, mapping) as { [T in Leaf<ComponentTokenLookup>]?: ComponentMappingTokenRef };
    return ObjectStream.of(refs).mapValues(ref => ref === undefined ? undefined : [ref]).collect() as GetComponentMapping<FlatSchema, Adjustments>;
}

export class ColorTokenStore extends SimpleTokenStore<FlatSchema, Seed, Adjustments> {
    constructor(schema: ColorSchema, seeds: readonly Seed[], content: GroupedContent) {
        super(schema, seeds, {
            standalones: content.seeds,
            primitive: flattenByLookup(schema.primitive, content.primitive) as GetPrimitiveValues<FlatSchema>,
            semantic: flattenSemanticMapping(schema.semantic, content.semantic),
            component: flattenComponentMapping(schema.component, content.component)
        }, "color");
    }
}

// ========== CSS ==========

export class ColorCSSEmitter extends SimpleCSSEmitter<FlatSchema, Seed, Adjustments> {
    protected override resolveRefValue(ref: ComponentMappingTokenRef): CSSValue {
        const value = super.resolveRefValue(ref);
        return ref.alpha === undefined ? value : `oklch(from ${value} l c h / ${ref.alpha})`;
    }
}
