import {round} from "svg-path-kit/numbers";

const TYPE_SCALE = {
    [0]: {
        fontSize: "var(--base-font-size)",
        lineHeight: "var(--base-line-height)",
        letterSpacing: "var(--base-letter-spacing)"
    }
};

const typeScaleProperties = [];

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
const midScaleRatio = (minScaleRatio + maxScaleRatio) / 2;

const baseLhRatio = 1.6;
const baseLetterSpacing = 0.035;
const lsOffset = 0.01;
// language=CSS prefix=":root {" suffix="}"
typeScaleProperties.push(
    `--scale-ratio: calc(${minScaleRatio} + ${maxScaleRatio - minScaleRatio} * var(--mobile-s-to-laptop-l))`,
    `--base-lh-ratio: ${baseLhRatio}`,
    `--base-letter-spacing: ${baseLetterSpacing}em`,
    `--ls-offset: ${lsOffset}em`,
);
const lhAddend = baseLhRatio - 1;
for (let i = -2; i <= 10; i++) {
    if (i === 0) continue;

    const step = i < 0 ? -i : i;
    const token = i < 0 ? `neg-${step}` : step;
    const operation = i < 0 ? "/" : "*";
    const operand2 = i === 1 ? "var(--scale-ratio)" : `pow(var(--scale-ratio), ${step})`;

    const fontSizePropertyName = "--font-size-" + token;
    const lineHeightPropertyName = "--line-height-" + token;
    const letterSpacingPropertyName = "--letter-spacing-" + token;

    TYPE_SCALE[i] = {
        fontSize: `var(${fontSizePropertyName})`,
        lineHeight: `var(${lineHeightPropertyName})`,
        letterSpacing: `var(${letterSpacingPropertyName})`
    };
    const scaleRatioInverse = Math.pow(midScaleRatio, -i);
    // language=CSS prefix=":root {" suffix="}"
    typeScaleProperties.push(
        `${fontSizePropertyName}: round(var(--base-font-size) ${operation} ${operand2}, 1px)`,
        `${lineHeightPropertyName}: ${round(1 + lhAddend * scaleRatioInverse, 1)}`,
        `${letterSpacingPropertyName}: ${round((baseLetterSpacing + lsOffset) * scaleRatioInverse - lsOffset, 4)}em`
    );
}

const HEADING_TOKENS = {
    h1: 6,
    h2: 5,
    h3: 4,
    h4: 3,
    h5: 2,
    h6: 1
};

const headingRules = [];

for (const [tag, index] of Object.entries(HEADING_TOKENS)) {
    const { fontSize, lineHeight, letterSpacing } = TYPE_SCALE[index];

    // language=CSS
    headingRules.push(
        `${tag} {
    font-size: ${fontSize};
    line-height: ${lineHeight};
    letter-spacing: ${letterSpacing};
    font-weight: normal;
}`
    );
}

const TEXT_TSHIRT_SIZES = {
    xs: -2,
    sm: -1,
    base: 0,
    lg: 1,
    xl: 2,
    "2xl": 3,
    "3xl": 4,
    "4xl": 5,
    "5xl": 6,
    "6xl": 7,
    "8xl": 9,
    "9xl": 10
};

const textTshirtSizeRules = [];

for (const [token, index] of Object.entries(TEXT_TSHIRT_SIZES)) {
    const { fontSize, lineHeight, letterSpacing } = TYPE_SCALE[index];

    // language=CSS
    textTshirtSizeRules.push(
`.text-${token} {
    font-size: ${fontSize};
    line-height: ${lineHeight};
    letter-spacing: ${letterSpacing};
}`
    );
}

// language=CSS
export default `
@layer base {
    :root {
        ${typeScaleProperties.join(";\n")};
    }
    ${headingRules.join("\n")}
}
@layer utilities {
    ${textTshirtSizeRules.join("\n")}
}
`;