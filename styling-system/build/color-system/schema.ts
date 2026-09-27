import type {
    GetComponentMapping, GetComponentMappingTokenRef,
    GetComponentToken, GetCSSCustomProperties,
    GetPrimitiveToken, GetPrimitiveValues,
    GetSemanticMapping, GetSemanticMappingTokenRef,
    GetSemanticToken, SchemaShape
} from "../shared/simple-tokens/schema-shape.ts";
import {createObjectFromEntries} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSCustomProperty, CSSValue} from "../shared/types.ts";

type FormatToken<S1 extends string, S2 extends string> = `${S1}-${S2}`;
function formatToken<S1 extends string, S2 extends string>(string1: S1, string2: S2): FormatToken<S1, S2> {
    return `${string1}-${string2}`;
}

type ColorSystemSchemaShape = {
    primitive: { [group: string]: readonly string[] };
    semantic: { [G in Target | string]: readonly string[] };
    component: { [component: string]: readonly Target[] };
    themes: readonly string[];
};

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

/* Every token of every level. Primitive tokens are grouped by ramp, steps lightest first. Semantic tokens are
   grouped by target, or by some other group for tokens that target no property (brand). Component tokens are
   grouped by component, each one listing the targets it colors - `btn-primary` below declares `bg-btn-primary`
   and `text-btn-primary`. Colors specific to one component's structure (artwork, one-off sections) live inside
   that component instead. Every theme defines the same semantic tokens. This structure stays internal: it's
   transformed below into the flat token names, lookups for them, and the shapes mappings and values must adhere to. */
const schema = {
    primitive: {
        "brand-1": STEPS,
        "brand-2": STEPS,
        "brand-3": STEPS,
        neutral: STEPS,
        "neutral-tinted": STEPS
    },
    semantic: {
        bg: ["canvas", "surface", "surface-raised", "overlay", "accent", "selection"],
        text: ["primary", "secondary", "tertiary", "accent", "on-accent"],
        border: ["default", "strong", "accent"],
        brand: ["1", "2", "3"]
    },
    component: {
        "btn-primary": ["bg", "text"],
        "btn-secondary": ["bg", "border"],
        toolbar: ["bg", "border", "text"],
        "toolbar-divider": ["bg"]
    },
    themes: ["dark"]
} as const satisfies ColorSystemSchemaShape;
type Schema = typeof schema;

/* Lookups: the nested structure a level is declared in, with the flat token name at each leaf -
   `semanticTokens.bg.canvas` is `"bg-canvas"`, `componentTokens["btn-primary"].bg` is `"bg-btn-primary"`. */

export type RampKey = keyof Schema["primitive"];
export type StepOf<R extends RampKey> = Schema["primitive"][R][number];
type PrimitiveTokenLookup = {
    [R in RampKey]: {
        [S in StepOf<R>]: FormatToken<R & string, S>;
    }
};
export const primitiveTokens = ObjectStream.of(schema.primitive)
    .mapEntryToValue((ramp, steps) => createObjectFromEntries(
        steps.map(step => [step, formatToken(ramp, step)] as const)
    ))
    .collect() as PrimitiveTokenLookup;

type SemanticTokenGroup = keyof Schema["semantic"];
type SemanticTokenVariant<G extends SemanticTokenGroup> = Schema["semantic"][G][number];
type SemanticTokenLookup = {
    [G in SemanticTokenGroup]: {
        [V in SemanticTokenVariant<G>]: FormatToken<G & string, V>;
    }
};
export const semanticTokens = ObjectStream.of(schema.semantic)
    .mapEntryToValue((group, variants) => createObjectFromEntries(
        variants.map(variant => [variant, formatToken(group, variant)] as const)
    ))
    .collect() as SemanticTokenLookup;

type Component = keyof Schema["component"];
type ComponentTokenVariant<C extends Component> = Schema["component"][C][number];
type ComponentTokenLookup = {
    [C in Component]: {
        [T in ComponentTokenVariant<C>]: `${T}-${C}`
    }
};
export const componentTokens = ObjectStream.of(schema.component)
    .mapEntryToValue((component, componentTargets) => createObjectFromEntries(
        componentTargets.map(target => [target, `${target}-${component}` as ComponentToken] as const)
    ))
    .collect() as ComponentTokenLookup;

export type Theme = Schema["themes"][number];

const flatSchema = {
    primitive: Object.values(primitiveTokens).flatMap(step => Object.values(step)),
    semantic: Object.values(semanticTokens).flatMap(variant => Object.values(variant)),
    component: Object.values(componentTokens).flatMap(variant => Object.values(variant)),
    modifiers: { theme: schema.themes }
} as const satisfies SchemaShape;
type FlatSchema = typeof flatSchema;

export type PrimitiveToken = GetPrimitiveToken<FlatSchema>;
export const primitiveTokensList: PrimitiveToken[] = flatSchema.primitive;

export type SemanticToken = GetSemanticToken<FlatSchema>;
export const semanticTokensList: SemanticToken[] = flatSchema.semantic;

export type ComponentToken = GetComponentToken<FlatSchema>;
export const componentTokensList: ComponentToken[] = flatSchema.component;

type AliasToken = SemanticToken | ComponentToken;

// Targets: the part of a token's name that says which CSS property it colors.
const targets = {
    bg: "background-color",
    text: "color",
    border: "border-color",
    fill: "fill",
    stroke: "stroke"
} as const satisfies { [target: string]: string };
export type Target = keyof typeof targets;
export type TargetProperty = typeof targets[Target];

// Flat token -> the CSS property it colors. Tokens without a target (brand) are left out.
export const TargetProperties: { [T in AliasToken]?: TargetProperty } = {
    ...ObjectStream.of(semanticTokens)
        .flatMap((group, roles) => ObjectStream.of(roles)
            .mapEntries((_role, flatToken) => [flatToken, (targets as Record<string, TargetProperty>)[group]])
        )
        .filter((_flatToken, targetProperty) => targetProperty !== undefined)
        .collect(),
    ...ObjectStream.of(componentTokens)
        .flatMap((_component, tokens) => ObjectStream.of(tokens)
            .mapEntries((target, flatToken) => [flatToken, targets[target]])
        )
        .collect()
};

// ========== Values ==========

export type GroupedPrimitiveValues = {
    [R in RampKey]: {
        [S in StepOf<R>]: CSSValue
    }
};
export type PrimitiveValues = GetPrimitiveValues<FlatSchema>;
export const flattenPrimitiveValues = (values: GroupedPrimitiveValues) => ObjectStream.of(primitiveTokens)
    .flatMap((group, variants) => ObjectStream.of(variants)
        .mapEntries((variant, token) => [
            token, values[group][variant]
        ])
    )
    .collect() as PrimitiveValues;

// ========== Custom Properties ==========

export type CSSCustomProperties = GetCSSCustomProperties<FlatSchema>;
export function buildCssCustomProperties(naming: (token: PrimitiveToken | AliasToken) => CSSCustomProperty): CSSCustomProperties {
    return createObjectFromEntries(
        [...primitiveTokensList, ...semanticTokensList, ...componentTokensList].map(token => [token, naming(token)] as const)
    );
}

// ========== Mapping ==========

// Every theme maps the same semantic tokens.
export type GroupedSemanticMapping = {
    [Th in Theme]: {
        [G in SemanticTokenGroup]: {
            [V in SemanticTokenVariant<G>]: SemanticMappingTokenRef
        }
    };
};

// Only the nested shape: how component tokens are named, and so the flat shape, is up to the implementation.
export type GroupedComponentMapping = {
    [C in Component]: {
        [V in ComponentTokenVariant<C>]: ComponentMappingTokenRef
    };
};

type Adjustments = { alpha?: number; };
// A mapped token points at one lower-level color, optionally at a reduced alpha.
export type SemanticMappingTokenRef = GetSemanticMappingTokenRef<FlatSchema, Adjustments>;
export type SemanticMapping = GetSemanticMapping<FlatSchema, Adjustments>;
export function flattenSemanticMapping(mapping: GroupedSemanticMapping): SemanticMapping {
    return ObjectStream.of(mapping)
        .flatMap((theme, themeMapping) => ObjectStream.of(semanticTokens)
            .flatMap((group, variants) => {
                const themeMappingElement = themeMapping[group] as Record<SemanticTokenVariant<SemanticTokenGroup>, SemanticMappingTokenRef>;
                return ObjectStream.of(variants)
                    .mapEntries((variant, token) => {
                        const mappingTokenRef = themeMappingElement[variant];
                        return [
                            token,
                            {...mappingTokenRef, modifiers: {...mappingTokenRef.modifiers, theme}}
                        ] as const;
                    });
            })
        )
        .collect();
}

export type ComponentMappingTokenRef = GetComponentMappingTokenRef<FlatSchema, Adjustments>;
export type ComponentMapping = GetComponentMapping<FlatSchema, Adjustments>;
export function flattenComponentMapping(mapping: GroupedComponentMapping): ComponentMapping {
    return ObjectStream.of(componentTokens)
        .flatMap((component, tokens) => ObjectStream.of(tokens)
            .mapEntries((target, flatToken) => [
                flatToken, (mapping[component] as Record<string, ComponentMappingTokenRef>)[target]
            ])
        )
        .collect();
}

