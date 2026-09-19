import {round} from "svg-path-kit/numbers";

const propertyDeclarations = [];
const ruleDeclarations = [];

const PRIMITIVE_WEIGHTS = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
};

const PRIMITIVE_PROPERTIES_LOOKUP = {
    base: {
        fontSize: "var(--base-font-size)",
        lineHeight: "var(--base-line-height)",
        letterSpacing: "var(--base-letter-spacing)"
    }
};
const PRIMITIVE_WEIGHTS_PROPERTIES_LOOKUP = {};
const SEMANTIC_PROPERTIES_LOOKUP = {};

for (const weightToken in PRIMITIVE_WEIGHTS) {
    const propertyName = `--font-weight-${weightToken}`;
    // language=CSS prefix=":root {" suffix="}"
    propertyDeclarations.push(`${propertyName}: ${PRIMITIVE_WEIGHTS[weightToken]}`);

    // language=CSS
    ruleDeclarations.push(`.font-${weightToken} { font-weight: var(${propertyName}); }`);
    PRIMITIVE_WEIGHTS_PROPERTIES_LOOKUP[weightToken] = `var(${propertyName})`;
}

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

function declareToken(token, source, declareProperties = true) {
    const fontSizePropertyName = `--${token}-size`;
    const lineHeightPropertyName = `--${token}-line-height`;
    const letterSpacingPropertyName = `--${token}-letter-spacing`;
    const fontWeightPropertyName = `--${token}-weight`;

    if (!declareProperties) {
        // language=CSS
        ruleDeclarations.push(
`.${token} {
    font-size: ${source.fontSize};
    line-height: ${source.lineHeight};
    letter-spacing: ${source.letterSpacing};
    font-weight: ${source.fontWeight};
}`
        );
        return;
    }

    // language=CSS prefix=":root {" suffix="}"
    propertyDeclarations.push(
        `${fontSizePropertyName}: ${source.fontSize}`,
        `${lineHeightPropertyName}: ${source.lineHeight}`,
        `${letterSpacingPropertyName}: ${source.letterSpacing}`,
        `${fontWeightPropertyName}: ${source.fontWeight}`
    );

    // language=CSS
    ruleDeclarations.push(
`.${token} {
    font-size: var(${fontSizePropertyName});
    line-height: var(${lineHeightPropertyName});
    letter-spacing: var(${letterSpacingPropertyName});
    font-weight: var(${fontWeightPropertyName});
}`
    );

    return {
        fontSize: `var(${fontSizePropertyName})`,
        lineHeight: `var(${lineHeightPropertyName})`,
        letterSpacing: `var(${letterSpacingPropertyName})`,
        fontWeight: `var(${fontWeightPropertyName})`,
    };
}

function primitiveTokens(size, weight = "regular") {
    return { size, weight };
}
// Semantic tokens: type role -> scale (sm/md/lg/xl) -> t-shirt size of the primitive group.
// Only the steps the site actually uses are defined.
const SEMANTIC_TO_PRIMITIVE_MAP = Object.fromEntries(Object
    .entries({
        display: {
            sm: primitiveTokens("5xl")
        },
        heading: {
            sm: primitiveTokens("xl"),
            md: primitiveTokens("2xl"),
            lg: primitiveTokens("3xl"),
            xl: primitiveTokens("4xl")
        },
        body: {
            sm: primitiveTokens("sm"),
            md: primitiveTokens("base"),
            lg: primitiveTokens("lg")
        }
    })
    .flatMap(([role, sizes]) => Object
        .entries(sizes)
        .map(([size, primitiveTokens]) => [`type-${role}-${size}`, primitiveTokens])
    )
);

for (const [token, primitiveTokens] of Object.entries(SEMANTIC_TO_PRIMITIVE_MAP)) {
    const properties = PRIMITIVE_PROPERTIES_LOOKUP[primitiveTokens.size];
    const fontWeight = PRIMITIVE_WEIGHTS_PROPERTIES_LOOKUP[primitiveTokens.weight];
    if (properties === undefined)
        throw new Error(`Unknown t-shirt size "${primitiveTokens.size}" for ${token}`);
    if (fontWeight === undefined)
        throw new Error(`Unknown font weight token "${fontWeight}" for ${token}`);

    SEMANTIC_PROPERTIES_LOOKUP[token] = declareToken(token, {...properties, fontWeight});
}

function semanticMapping(semanticToken, weightOverride) {
    return { semanticToken, weightOverride };
}
// Context tokens: where the text sits in the page's content structure -> semantic token.
// Deliberately generic ("section", "item", "hero"), never tied to a single component.
const CONTEXT_TO_SEMANTIC_MAP = {
    "hero-heading": semanticMapping("type-display-sm"),
    "section-title": semanticMapping("type-heading-xl"),
    "section-subtitle": semanticMapping("type-heading-md"),
    "item-title": semanticMapping("type-heading-lg"),
    "item-subtitle": semanticMapping("type-heading-sm"),
    "logo-text": semanticMapping("type-body-lg", "medium")
};

for (const [token, mapping] of Object.entries(CONTEXT_TO_SEMANTIC_MAP)) {
    const semantic = SEMANTIC_PROPERTIES_LOOKUP[mapping.semanticToken];
    const fontWeight = PRIMITIVE_WEIGHTS_PROPERTIES_LOOKUP[mapping.weightOverride];
    if (semantic === undefined)
        throw new Error(`Unknown semantic token "${mapping.semanticToken}" for ${token}`);
    if (mapping.weightOverride && fontWeight === undefined)
        throw new Error(`Unknown font weight token "${fontWeight}" for ${token}`);

    const source = {...semantic};
    if (fontWeight)
        source.fontWeight = fontWeight;
    declareToken(token, source, false);
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