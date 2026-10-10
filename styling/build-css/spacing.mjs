const MAX_STEP = 32;

const SPACE_VAR_NAMES = Object.fromEntries(
    Array.from({ length: MAX_STEP }, (_, i) => [i + 1, `--space-${i + 1}`])
);

const spacingProperties = Object.entries(SPACE_VAR_NAMES)
    .map(([step, varName]) => `${varName}: ${Number(step) * 0.25}rem`);

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
