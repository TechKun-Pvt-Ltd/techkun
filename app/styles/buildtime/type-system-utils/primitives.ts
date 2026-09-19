import {round} from "svg-path-kit/numbers";
import {
    CSS_PROPERTY_NAME,
    declare, getTokensByProperty,
    PROPERTIES, rule
} from "./shared.ts";
import type {Property, TokensByProperty, TShirtSizeToken} from "./shared.ts";

/* Primitive tokens: the raw scales (size, line height, letter spacing, weight), tied to a property. */

/* Scale ratio — choose a musical interval:
   Minor Second:   1.067  (2 semitones)
   Major Second:   1.125  (2 semitones × semitone)
   Minor Third:    1.189
   Major Third:    1.260  ← a good default for UI
   Perfect Fourth: 1.333
   Tritone:        1.414
   Perfect Fifth:  1.500
*/
const MIN_SCALE_RATIO = 1.125;
const MAX_SCALE_RATIO = 1.260;
// language=CSS prefix="div { --var: " suffix="; }"
const SCALE_RATIO = `calc(${MIN_SCALE_RATIO} + ${MAX_SCALE_RATIO - MIN_SCALE_RATIO} * var(--mobile-s-to-laptop-mid))`;

// Inputs of the scale. `--base-font-size` is the remaining one and lives in theme/typography.css.
const BASE_LINE_HEIGHT = 1.6;
const BASE_LETTER_SPACING = 0.035;
const LS_OFFSET = 0.01;

// Size token -> power of the scale ratio its values derive from.
const TOKEN_TO_POWER: Record<TShirtSizeToken, number> = {
    xs: -2,
    sm: -1,
    base: 0,
    lg: 1,
    xl: 2,
    "2xl": 3,
    "3xl": 4,
    "4xl": 5,
    "5xl": 6,
    "6xl": 7
};

function createTypeScale() {
    const fontSize: Partial<Record<TShirtSizeToken, string | number>> = {};
    const lineHeight: Partial<Record<TShirtSizeToken, string | number>> = {};
    const letterSpacing: Partial<Record<TShirtSizeToken, string | number>> = {};
    const lhAddend = BASE_LINE_HEIGHT - 1;
    for (const [token, power] of Object.entries(TOKEN_TO_POWER) as [TShirtSizeToken, number][]) {
        if (token === "base") {
            // The scale's inputs. Font size has no base value: `--base-font-size` lives in theme/typography.css.
            lineHeight[token] = BASE_LINE_HEIGHT;
            letterSpacing[token] = `${BASE_LETTER_SPACING}em`;
            continue;
        }

        const operation = power < 0 ? "/" : "*";
        const operand = power === 1 ? "var(--scale-ratio)" : `pow(var(--scale-ratio), ${Math.abs(power)})`;
        const scaleRatioInverse = Math.pow(MAX_SCALE_RATIO, -power);

        // language=CSS prefix="div { --var: " suffix="; }"
        fontSize[token] = `round(var(--base-font-size) ${operation} ${operand}, 1px)`;
        lineHeight[token] = round(1 + lhAddend * scaleRatioInverse, 1);
        letterSpacing[token] = `${round((BASE_LETTER_SPACING + LS_OFFSET) * scaleRatioInverse - LS_OFFSET, 4)}em`;
    }
    return {
        fontSize: fontSize as TokenValues<"fontSize">,
        lineHeight: lineHeight as TokenValues<"lineHeight">,
        letterSpacing: letterSpacing as TokenValues<"letterSpacing">
    };
}

type TokenValues<P extends Property> = {
    [T in TokensByProperty[P]]: string | number;
};

const WEIGHTS: TokenValues<"fontWeight"> = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
};

const PRIMITIVES: { [P in Property]: TokenValues<P> } = {
    ...createTypeScale(),
    fontWeight: WEIGHTS
};

type PrimitivePropertyNamesByToken = {
    [P in Property]: {
        [T in TokensByProperty[P]]: string;
    };
};

// Lookup: token -> CSS custom property name, generated from the token lists alone. [property][token].
const PRIMITIVE_PROPERTY_NAMES_BY_TOKEN = Object.fromEntries(PROPERTIES.map(
    property => ([
        property,
        Object.fromEntries(
            getTokensByProperty(property)
                .map(token => [
                    token,
                    token === "base" ?
                        `--${token}-${CSS_PROPERTY_NAME[property as Property]}` :
                        `--${CSS_PROPERTY_NAME[property as Property]}-${token}`
                ])
        )
    ])
)) as PrimitivePropertyNamesByToken;

export function resolvePrimitiveToken<P extends Property>(property: P, token?: TokensByProperty[P]) {
    const name = token ? PRIMITIVE_PROPERTY_NAMES_BY_TOKEN[property]?.[token] : undefined;
    if (name === undefined)
        throw new Error(`Unknown ${property} token "${token}".`);
    return `var(${name})`;
}

// Custom properties declared under :root: name -> value.
export const PRIMITIVE_PROPERTIES = {
    "--scale-ratio": SCALE_RATIO,
    "--ls-offset": `${LS_OFFSET}em`,
    ...declare(PRIMITIVES, PRIMITIVE_PROPERTY_NAMES_BY_TOKEN)
};

export const PRIMITIVE_RULES = Object
    .entries(PRIMITIVE_PROPERTY_NAMES_BY_TOKEN.fontWeight)
    .map(([token, propertyName]) => rule(`.font-${token}`, {fontWeight: `var(${propertyName})`}));
