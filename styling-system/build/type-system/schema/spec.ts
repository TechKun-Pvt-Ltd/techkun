import type {SchemaShape} from "../../shared/composite-tokens/schema-shape.ts";

type TypeSystemSchemaShape = {
    primitive: SchemaShape["primitive"];
    semantic: { [role: string]: readonly string[] };
    component: readonly string[];
};

/* Every token of every level. Primitive tokens are grouped by proxy property - a group of CSS properties
   a token sets together. Semantic tokens are grouped by role. Component tokens are a flat list. Semantic and
   component tokens set every proxy property. This structure stays internal: lookups.ts transforms it into the
   flat token names and lookups for them, and shapes.ts into the shapes mappings and values must adhere to. */
export const spec = {
    primitive: {
        "type-size": {
            variants: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
            properties: ["font-size", "line-height", "letter-spacing"]
        },
        weight: {
            variants: ["regular", "medium", "semibold", "bold"],
            properties: ["font-weight"]
        }
    },
    semantic: {
        display: ["sm"],
        heading: ["sm", "md", "lg", "xl"],
        body: ["sm", "md", "lg"]
    },
    component: ["hero-heading", "section-title", "section-subtitle", "item-title", "item-subtitle", "logo-text"]
} as const satisfies TypeSystemSchemaShape;
export type Spec = typeof spec;
