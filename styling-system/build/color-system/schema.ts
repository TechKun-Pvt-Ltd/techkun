import {createObjectFromEntries} from "../shared/utils.ts";
import type {CSSValue} from "../shared/types.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

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
} as const satisfies {
    primitive: { [rampKey: string]: readonly string[] };
    semantic: { [group: string]: readonly string[] };
    component: { [component: string]: readonly Target[] };
    themes: readonly string[];
};
type Schema = typeof schema;

export type RampKey = keyof Schema["primitive"];
export type StepOf<R extends RampKey> = Schema["primitive"][R][number];

type SemanticGroup = keyof Schema["semantic"];
type RoleOf<G extends SemanticGroup> = Schema["semantic"][G][number];

type Component = keyof Schema["component"];
type TargetOf<C extends Component> = Schema["component"][C][number];

export type Theme = Schema["themes"][number];

export type PrimitiveToken = { [R in RampKey]: `${R}-${StepOf<R>}` }[RampKey];
export type SemanticToken = { [G in SemanticGroup]: `${G}-${RoleOf<G>}` }[SemanticGroup];
export type ComponentToken = { [C in Component]: `${TargetOf<C>}-${C}` }[Component];
export type Token = PrimitiveToken | SemanticToken | ComponentToken;

/* Lookups: the nested structure a level is declared in, with the flat token name at each leaf -
   `semanticTokens.bg.canvas` is `"bg-canvas"`, `componentTokens["btn-primary"].bg` is `"bg-btn-primary"`. */
type PrimitiveTokenLookup = { [R in RampKey]: { [S in StepOf<R>]: `${R}-${S}` } };
type SemanticTokenLookup = { [G in SemanticGroup]: { [V in RoleOf<G>]: `${G}-${V}` } };
type ComponentTokenLookup = { [C in Component]: { [T in TargetOf<C>]: `${T}-${C}` } };

export const primitiveTokens = ObjectStream.of(schema.primitive)
    .mapEntryToValue((rampKey, steps) => createObjectFromEntries(
        steps.map(step => [step, `${rampKey}-${step}` as PrimitiveToken] as const)
    ))
    .collect() as PrimitiveTokenLookup;
export const semanticTokens = ObjectStream.of(schema.semantic)
    .mapEntryToValue((group, roles) => createObjectFromEntries(
        roles.map(role => [role, `${group}-${role}` as SemanticToken] as const)
    ))
    .collect() as SemanticTokenLookup;
export const componentTokens = ObjectStream.of(schema.component)
    .mapEntryToValue((component, componentTargets) => createObjectFromEntries(
        componentTargets.map(target => [target, `${target}-${component}` as ComponentToken] as const)
    ))
    .collect() as ComponentTokenLookup;

export const PrimitiveTokensList: PrimitiveToken[] = Object.values(primitiveTokens).flatMap(Object.values);
export const SemanticTokensList: SemanticToken[] = Object.values(semanticTokens).flatMap(Object.values);
export const ComponentTokensList: ComponentToken[] = Object.values(componentTokens).flatMap(Object.values);

// Flat token -> the CSS property it colors. Tokens without a target (brand) are left out.
export const TargetProperties: { [T in SemanticToken | ComponentToken]?: TargetProperty } = {
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

// A mapped token points at one lower-level color, optionally at a reduced alpha.
export type TokenRef = {
    tokenRef: PrimitiveToken | SemanticToken;
    alpha?: number;
};

// Shapes values and mappings are declared in.
export type PrimitiveValues = { [R in RampKey]: { [S in StepOf<R>]: CSSValue } };
export type SemanticMapping = { [G in SemanticGroup]: { [V in RoleOf<G>]: TokenRef } };
export type ComponentMapping = { [C in Component]: { [T in TargetOf<C>]: TokenRef } };

// Flat counterparts: keyed by flat token name.
export type FlatPrimitiveValues = { [T in PrimitiveToken]: CSSValue };
export type FlatSemanticMapping = { [T in SemanticToken]: TokenRef };
export type FlatComponentMapping = { [T in ComponentToken]: TokenRef };

/* Flatten values/mappings declared in a level's nested shape into maps keyed by flat token name, by walking
   that level's lookup. */
export function flattenPrimitiveValues(values: PrimitiveValues): FlatPrimitiveValues {
    return ObjectStream.of(primitiveTokens)
        .flatMap((rampKey, steps) => ObjectStream.of(steps)
            .mapEntries((step, flatToken) => [
                flatToken, (values[rampKey] as Record<string, CSSValue>)[step]
            ])
        )
        .collect() as FlatPrimitiveValues;
}
export function flattenSemanticMapping(mapping: SemanticMapping): FlatSemanticMapping {
    return ObjectStream.of(semanticTokens)
        .flatMap((group, roles) => ObjectStream.of(roles)
            .mapEntries((role, flatToken) => [
                flatToken, (mapping[group] as Record<string, TokenRef>)[role]
            ])
        )
        .collect() as FlatSemanticMapping;
}
export function flattenComponentMapping(mapping: ComponentMapping): FlatComponentMapping {
    return ObjectStream.of(componentTokens)
        .flatMap((component, tokens) => ObjectStream.of(tokens)
            .mapEntries((target, flatToken) => [
                flatToken, (mapping[component] as Record<string, TokenRef>)[target]
            ])
        )
        .collect() as FlatComponentMapping;
}
