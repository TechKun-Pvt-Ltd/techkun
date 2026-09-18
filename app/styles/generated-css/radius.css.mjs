// A small t-shirt scale for corner rounding. Unlike spacing's linear 4px-base
// scale (see spacing.css.mjs), radius has no reason to cover dozens of
// steps — these are exactly the values already in use across the app
// (design-system audit), named consistently with typography's t-shirt sizes.
// --radius-full stays 100vh (not e.g. 9999px) to match every existing pill
// usage exactly, so migrating call sites onto this token is a no-op visually.
const RADIUS_SCALE = {
    none: "0",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "100vh"
};

const radiusProperties = Object.entries(RADIUS_SCALE)
    .map(([token, value]) => `--radius-${token}: ${value}`);

const utilityRules = Object.keys(RADIUS_SCALE)
    .map((token) => `.rounded-${token} { border-radius: var(--radius-${token}); }`);

// language=CSS
export default `
@layer base {
    :root {
        ${radiusProperties.join(";\n        ")};
    }
}
@layer utilities {
    ${utilityRules.join("\n    ")}
}
`;
