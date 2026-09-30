// Targets: the part of a token's name that says which CSS property it colors.
export const TARGETS = ["bg", "text", "border", "fill", "stroke"] as const;
export type Target = typeof TARGETS[number];

type ColorSystemSchemaShape = {
    primitive: { [group: string]: readonly string[] };
    semantic: { [G in Target]?: readonly string[] } & { [group: string]: readonly string[] };
    component: { [component: string]: readonly Target[] };
    themes: readonly ("light" | "dark")[];
};

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

export const spec = {
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
