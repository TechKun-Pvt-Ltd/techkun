import {round} from "svg-path-kit/numbers";

const propertyDeclarations = [];
const ruleDeclarations = [];

const PRIMITIVE_PROPERTIES_LOOKUP = {
    base: {
        fontSize: "var(--base-font-size)",
        lineHeight: "var(--base-line-height)",
        letterSpacing: "var(--base-letter-spacing)"
    }
};
const SEMANTIC_PROPERTIES_LOOKUP = {};

/* Scale ratio — choose a musical interval:
   Minor Second:   1.067  (2 semitones)
   Major Second:   1.125  (2 semitones × semitone)
   Minor Third:    1.189
   Major Third:    1.260  ← a good default for UI
   Perfect Fourth: 1.333
   Tritone:        1.414
   Perfect Fifth:  1.500
*/
const minScaleRatio = 1.125;
const maxScaleRatio = 1.260;

const baseLhRatio = 1.6;
const baseLetterSpacing = 0.035;
const lsOffset = 0.01;
// language=CSS prefix=":root {" suffix="}"
propertyDeclarations.push(
    `--scale-ratio: calc(${minScaleRatio} + ${maxScaleRatio - minScaleRatio} * var(--mobile-s-to-laptop-mid))`,
    `--base-line-height: ${baseLhRatio}`,
    `--base-letter-spacing: ${baseLetterSpacing}em`,
    `--ls-offset: ${lsOffset}em`,
);

const STEP_TO_SIZE_MAP = {
    [-2]: "xs",
    [-1]: "sm",
    0: "base",
    1: "lg",
    2: "xl",
    3: "2xl",
    4: "3xl",
    5: "4xl",
    6: "5xl",
    7: "6xl"
};

const lhAddend = baseLhRatio - 1;
for (let i = -2; i <= 10; i++) {
    if (i === 0) continue;

    const token = STEP_TO_SIZE_MAP[i];
    if (token === undefined) continue;

    const step = i < 0 ? -i : i;
    const operation = i < 0 ? "/" : "*";
    const operand2 = i === 1 ? "var(--scale-ratio)" : `pow(var(--scale-ratio), ${step})`;

    const fontSizePropertyName = "--font-size-" + token;
    const lineHeightPropertyName = "--line-height-" + token;
    const letterSpacingPropertyName = "--letter-spacing-" + token;

    PRIMITIVE_PROPERTIES_LOOKUP[token] = {
        fontSize: `var(${fontSizePropertyName})`,
        lineHeight: `var(${lineHeightPropertyName})`,
        letterSpacing: `var(${letterSpacingPropertyName})`
    };
    const scaleRatioInverse = Math.pow(maxScaleRatio, -i);
    // language=CSS prefix=":root {" suffix="}"
    propertyDeclarations.push(
        `${fontSizePropertyName}: round(var(--base-font-size) ${operation} ${operand2}, 1px)`,
        `${lineHeightPropertyName}: ${round(1 + lhAddend * scaleRatioInverse, 1)}`,
        `${letterSpacingPropertyName}: ${round((baseLetterSpacing + lsOffset) * scaleRatioInverse - lsOffset, 4)}em`
    );
}

// Declares the custom properties and the utility class of a token, resolving its
// values from `source` (a { fontSize, lineHeight, letterSpacing } entry of a lookup).
// Returns the token's own lookup entry so the next layer can alias it.
function declareToken(token, source) {
    const fontSizePropertyName = `--${token}-size`;
    const lineHeightPropertyName = `--${token}-line-height`;
    const letterSpacingPropertyName = `--${token}-letter-spacing`;

    // language=CSS prefix=":root {" suffix="}"
    propertyDeclarations.push(
        `${fontSizePropertyName}: ${source.fontSize}`,
        `${lineHeightPropertyName}: ${source.lineHeight}`,
        `${letterSpacingPropertyName}: ${source.letterSpacing}`
    );

    // language=CSS
    ruleDeclarations.push(
`.${token} {
    font-size: var(${fontSizePropertyName});
    line-height: var(${lineHeightPropertyName});
    letter-spacing: var(${letterSpacingPropertyName});
}`
    );

    return {
        fontSize: `var(${fontSizePropertyName})`,
        lineHeight: `var(${lineHeightPropertyName})`,
        letterSpacing: `var(${letterSpacingPropertyName})`,
    };
}

// Semantic tokens: type role -> scale (sm/md/lg/xl) -> t-shirt size of the primitive group.
// Only the steps the site actually uses are defined.
const SEMANTIC_TO_PRIMITIVE_MAP = Object.fromEntries(Object
    .entries({
        display: {sm: "5xl"},
        heading: {sm: "xl", md: "2xl", lg: "3xl", xl: "4xl"},
        body: {sm: "sm", md: "base", lg: "lg"}
    })
    .flatMap(([role, sizes]) => Object
        .entries(sizes)
        .map(([size, tShirtToken]) => [`type-${role}-${size}`, tShirtToken])
    )
);

for (const [token, tShirtSize] of Object.entries(SEMANTIC_TO_PRIMITIVE_MAP)) {
    const primitive = PRIMITIVE_PROPERTIES_LOOKUP[tShirtSize];
    if (primitive === undefined)
        throw new Error(`Unknown t-shirt size "${tShirtSize}" for ${token}`);

    SEMANTIC_PROPERTIES_LOOKUP[token] = declareToken(token, primitive);
}

// Context tokens: where the text sits in the page's content structure -> semantic token.
// Deliberately generic ("section", "item", "hero"), never tied to a single component.
const CONTEXT_TO_SEMANTIC_MAP = {
    "hero-heading": "type-display-sm",
    "section-title": "type-heading-xl",
    "section-subtitle": "type-heading-md",
    "item-title": "type-heading-lg",
    "item-subtitle": "type-heading-sm",
    "logo-text": "type-body-lg"
};

for (const [token, semanticToken] of Object.entries(CONTEXT_TO_SEMANTIC_MAP)) {
    const semantic = SEMANTIC_PROPERTIES_LOOKUP[semanticToken];
    if (semantic === undefined)
        throw new Error(`Unknown semantic token "${semanticToken}" for ${token}`);

    declareToken(token, semantic);
}

// language=CSS
export default `
@layer base {
    :root {
        ${propertyDeclarations.join(";\n")};
    }
}
@layer utilities {
    ${ruleDeclarations.join("\n")}
}
`.trim();