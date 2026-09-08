// A linear 4px-base scale: --space-N is always N * 4px, for every N from 1
// to MAX_STEP. 32 (128px) covers the largest round gap/padding value seen
// repeated more than once in the design-system audit of existing sections
// (03_Our_Principles + all three app/photos pages).
//
// Values are px, not rem: this scale is for layout rhythm (gap/padding/margin
// between elements), which — unlike `theme/layout.css`'s --navbar-height or
// the type scale — has no reason to track the root font-size. Keeping it in
// px also avoids silently coupling every gap/padding in the app to
// --base-font-size if that ever becomes viewport-fluid (see
// --mobile-s-to-laptop-mid in theme/viewport.css).
const MAX_STEP = 32;

// Single source of truth for the custom property name behind each step.
// Both the :root declarations and the utility classes read from this instead
// of separately re-deriving `--space-${n}`.
const SPACE_VAR_NAMES = Object.fromEntries(
    Array.from({ length: MAX_STEP }, (_, i) => [i + 1, `--space-${i + 1}`])
);

const spacingProperties = Object.entries(SPACE_VAR_NAMES)
    .map(([step, varName]) => `${varName}: ${step * 4}px`);

// Prefixes follow Tailwind's naming, but map onto logical properties (not
// physical top/bottom) to match how the rest of this codebase writes
// padding/margin/gap — see e.g. theme/layout.css and components.css. l/r
// still resolve to inline-start/inline-end (not literal left/right).
const UTILITY_PROPERTIES = [
    { prefix: "p", property: "padding" },
    { prefix: "px", property: "padding-inline" },
    { prefix: "py", property: "padding-block" },
    { prefix: "pl", property: "padding-inline-start" },
    { prefix: "pr", property: "padding-inline-end" },
    { prefix: "pt", property: "padding-block-start" },
    { prefix: "pb", property: "padding-block-end" },
    { prefix: "m", property: "margin" },
    { prefix: "mx", property: "margin-inline" },
    { prefix: "my", property: "margin-block" },
    { prefix: "ml", property: "margin-inline-start" },
    { prefix: "mr", property: "margin-inline-end" },
    { prefix: "mt", property: "margin-block-start" },
    { prefix: "mb", property: "margin-block-end" },
    { prefix: "gap", property: "gap" },
    { prefix: "gap-x", property: "column-gap" },
    { prefix: "gap-y", property: "row-gap" }
];

const utilityRules = UTILITY_PROPERTIES.flatMap(({ prefix, property }) =>
    Object.entries(SPACE_VAR_NAMES).map(
        ([step, varName]) => `.${prefix}-${step} { ${property}: var(${varName}); }`
    )
);

// language=CSS
export default `
@layer base {
    :root {
        ${spacingProperties.join(";\n        ")};
    }
}
@layer utilities {
    ${utilityRules.join("\n    ")}
}
`;
