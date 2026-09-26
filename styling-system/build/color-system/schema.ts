import {
    type GetComponentTokenGroup,
    type GetComponentTokenVariant,
    type GetPrimitiveToken,
    getPrimitiveTokenLookup,
    type GetPrimitiveTokenGroup,
    type GetPrimitiveTokenVariant,
    type GetSemanticToken,
    getSemanticTokenLookup,
    type GetTheme,
    type SchemaShape
} from "../shared/value-tokens/schema-shape.ts";
import {
    type GetGroupedPrimitiveValues,
    type GetPrimitiveValues,
    getPrimitiveValuesFlattener
} from "../shared/value-tokens/values-schema.ts";
import {
    type GetGroupedComponentMapping,
    type GetGroupedSemanticMapping,
    type GetSemanticMapping,
    getSemanticMappingFlattener,
    type GetTokenRef
} from "../shared/value-tokens/mapping-schema.ts";
import {
    getCustomPropertiesBuilder,
    type GetCustomProperties
} from "../shared/value-tokens/css-custom-properties-schema.ts";
import {createObjectFromEntries} from "../shared/utils.ts";
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
} as const satisfies SchemaShape & { component: { [component: string]: readonly Target[] } };
type Schema = typeof schema;

export type RampKey = GetPrimitiveTokenGroup<Schema>;
export type StepOf<R extends RampKey> = GetPrimitiveTokenVariant<Schema, R>;

type Component = GetComponentTokenGroup<Schema>;
type ComponentTokenVariant<C extends Component> = GetComponentTokenVariant<Schema, C>;

export type Theme = GetTheme<Schema>;

export type PrimitiveToken = GetPrimitiveToken<Schema>;
export type SemanticToken = GetSemanticToken<Schema>;
// Target first, like semantic tokens grouped by target: the target is what TargetProperties reads off.
export type ComponentToken = { [C in Component]: `${ComponentTokenVariant<C>}-${C}` }[Component];
export type Token = PrimitiveToken | SemanticToken | ComponentToken;

/* Lookups: the nested structure a level is declared in, with the flat token name at each leaf -
   `semanticTokens.bg.canvas` is `"bg-canvas"`, `componentTokens["btn-primary"].bg` is `"bg-btn-primary"`. */
type ComponentTokenLookup = { [C in Component]: { [T in ComponentTokenVariant<C>]: `${T}-${C}` } };

export const primitiveTokens = getPrimitiveTokenLookup(schema);
export const semanticTokens = getSemanticTokenLookup(schema);
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

export type GroupedPrimitiveValues = GetGroupedPrimitiveValues<Schema>;
export type PrimitiveValues = GetPrimitiveValues<Schema>;
export const flattenPrimitiveValues = getPrimitiveValuesFlattener(primitiveTokens);

// A mapped token points at one lower-level color, optionally at a reduced alpha.
export type TokenRef = GetTokenRef<Schema> & { alpha?: number };

export type GroupedSemanticMapping = GetGroupedSemanticMapping<Schema, TokenRef>;
export type SemanticMapping = GetSemanticMapping<Schema, TokenRef>;
export const flattenSemanticMapping = getSemanticMappingFlattener<Schema, TokenRef>(semanticTokens);

export type GroupedComponentMapping = GetGroupedComponentMapping<Schema, TokenRef>;
export type ComponentMapping = { [T in ComponentToken]: TokenRef };
export function flattenComponentMapping(mapping: GroupedComponentMapping): ComponentMapping {
    return ObjectStream.of(componentTokens)
        .flatMap((component, tokens) => ObjectStream.of(tokens)
            .mapEntries((target, flatToken) => [
                flatToken, (mapping[component] as Record<string, TokenRef>)[target]
            ])
        )
        .collect() as ComponentMapping;
}


export type CustomProperties = GetCustomProperties<Schema, ComponentToken>;
export const buildCustomProperties = getCustomPropertiesBuilder<Schema, ComponentToken>(PrimitiveTokensList, SemanticTokensList, ComponentTokensList);
