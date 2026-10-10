import {
    ColorSchema, type ColorSystemSchemaShape, type GetColorComponentMappingTokenRef, type GetColorSemanticMappingTokenRef,
    type GetFlatSchema, type GetGroupedComponentMapping, type GetGroupedPrimitiveValues, type GetGroupedSemanticMapping,
    type GetRampKey, type GetTheme
} from "../../styling-system/color-system/system.ts";

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

const spec = {
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
export type Spec = typeof spec;

export type RampKey = GetRampKey<Spec>;
export type Theme = GetTheme<Spec>;
export type FlatSchema = GetFlatSchema<Spec>;
export type SemanticMappingTokenRef = GetColorSemanticMappingTokenRef<Spec>;
export type ComponentMappingTokenRef = GetColorComponentMappingTokenRef<Spec>;
export type GroupedPrimitiveValues = GetGroupedPrimitiveValues<Spec>;
export type GroupedSemanticMapping = GetGroupedSemanticMapping<Spec>;
export type GroupedComponentMapping = GetGroupedComponentMapping<Spec>;

export const colorSchema = new ColorSchema(spec);
