import type {
    GetComponentToken,
    GetPrimitiveToken,
    GetSemanticToken, SchemaShape
} from "../../shared/simple-tokens/schema-shape.ts";
import {createObjectFromEntries} from "../../shared/utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import {spec, TARGETS, type Spec, type Target} from "./spec.ts";

type FormatToken<S1 extends string, S2 extends string> = `${S1}-${S2}`;
function formatToken<S1 extends string, S2 extends string>(string1: S1, string2: S2): FormatToken<S1, S2> {
    return `${string1}-${string2}`;
}

/* Lookups: the nested structure a level is declared in, with the flat token name at each leaf -
   `semanticTokens.bg.canvas` is `"bg-canvas"`, `componentTokens["btn-primary"].bg` is `"bg-btn-primary"`. */

export type RampKey = keyof Spec["primitive"];
export type StepOf<R extends RampKey> = Spec["primitive"][R][number];
type PrimitiveTokenLookup = {
    [R in RampKey]: {
        [S in StepOf<R>]: FormatToken<R & string, S>;
    }
};
export const primitiveTokens = ObjectStream.of(spec.primitive)
    .mapEntryToValue((ramp, steps) => createObjectFromEntries(
        steps.map(step => [step, formatToken(ramp, step)] as const)
    ))
    .collect() as PrimitiveTokenLookup;

export type SemanticTokenGroup = keyof Spec["semantic"];
export type SemanticTokenVariant<G extends SemanticTokenGroup> = Spec["semantic"][G][number];
type SemanticTokenLookup = {
    [G in SemanticTokenGroup]: {
        [V in SemanticTokenVariant<G>]: FormatToken<G & string, V>;
    }
};
export const semanticTokens = ObjectStream.of(spec.semantic)
    .mapEntryToValue((group, variants) => createObjectFromEntries(
        variants.map(variant => [variant, formatToken(group, variant)] as const)
    ))
    .collect() as SemanticTokenLookup;

export type Component = keyof Spec["component"];
export type ComponentTokenVariant<C extends Component> = Spec["component"][C][number];
type ComponentTokenLookup = {
    [C in Component]: {
        [T in ComponentTokenVariant<C>]: `${T}-${C}`
    }
};
export const componentTokens = ObjectStream.of(spec.component)
    .mapEntryToValue((component, componentTargets) => createObjectFromEntries(
        componentTargets.map(target => [target, formatToken(target, component)] as const)
    ))
    .collect() as ComponentTokenLookup;

export type Theme = Spec["themes"][number];

const flatSchema = {
    primitive: Object.values(primitiveTokens).flatMap(steps => Object.values(steps)),
    semantic: Object.values(semanticTokens).flatMap(variants => Object.values(variants)),
    component: Object.values(componentTokens).flatMap(variants => Object.values(variants)),
    modifiers: { theme: spec.themes }
} as const satisfies SchemaShape;
export type FlatSchema = typeof flatSchema;

export type PrimitiveToken = GetPrimitiveToken<FlatSchema>;
export const primitiveTokensList: PrimitiveToken[] = flatSchema.primitive;

export type SemanticToken = GetSemanticToken<FlatSchema>;
export const semanticTokensList: SemanticToken[] = flatSchema.semantic;

export type ComponentToken = GetComponentToken<FlatSchema>;
export const componentTokensList: ComponentToken[] = flatSchema.component;

export type AliasToken = SemanticToken | ComponentToken;

function isTarget(group: string): group is Target {
    return (TARGETS as readonly string[]).includes(group);
}

// Flat token -> the target it colors. Tokens without a target (brand) are left out.
export const tokenTargets: { [T in AliasToken]?: Target } = {
    ...ObjectStream.of(semanticTokens)
        .flatMap((group, variants) => isTarget(group)
            ? ObjectStream.of(variants).mapEntries((_variant, flatToken) => [flatToken, group])
            : {}
        )
        .collect(),
    ...ObjectStream.of(componentTokens)
        .flatMap((_component, tokens) => ObjectStream.of(tokens)
            .mapEntries((target, flatToken) => [flatToken, target])
        )
        .collect()
};
