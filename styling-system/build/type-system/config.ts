import type {CSSProperty, CSSValue} from "./shared.ts";

const T_SHIRT_SIZE_TOKENS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const;
const WEIGHT_TOKENS = ["regular", "medium", "semibold", "bold"] as const;

const TokensByProperty = {
    fontVariant: T_SHIRT_SIZE_TOKENS,
    fontWeight: WEIGHT_TOKENS
} satisfies Record<string, readonly string[]>;
export type Property = keyof typeof TokensByProperty;
export type PropertyToken<P extends Property> = typeof TokensByProperty[P][number];
export type FontVariantToken = PropertyToken<"fontVariant">;
export type WeightToken = PropertyToken<"fontWeight">;

const CSSPropertiesByProperty = {
    fontVariant: ["font-size", "line-height", "letter-spacing"],
    fontWeight: "font-weight"
} satisfies Record<Property, CSSProperty | CSSProperty[]>;
type UnwrapArray<A> = A extends any[] ? A[number] : A;
export type CSSPropertiesByProperty<K extends keyof typeof CSSPropertiesByProperty> = UnwrapArray<typeof CSSPropertiesByProperty[K]>;

export type CSSPropertyValues<P extends Property = Property> = {
    [CP in CSSPropertiesByProperty<P>]: CSSValue;
};
export type PrimitiveValues = {
    [P in Property]: {
        [T in PropertyToken<P>]: CSSPropertyValues<P>;
    };
};

export type PrimitiveMapping = {
    [P in Property]: PropertyToken<P>;
};
function primitiveMapping(fontVariantToken: FontVariantToken, weightToken: WeightToken = "regular"): PrimitiveMapping {
    return {fontVariant: fontVariantToken, fontWeight: weightToken};
}
// Semantic tokens: type role -> scale (sm/md/lg/xl) -> primitive tokens.
// Only the steps the site actually uses are defined.
const semanticToPrimitiveGrouped = {
    display: {
        sm: primitiveMapping("5xl")
    },
    heading: {
        sm: primitiveMapping("xl"),
        md: primitiveMapping("2xl"),
        lg: primitiveMapping("3xl"),
        xl: primitiveMapping("4xl")
    },
    body: {
        sm: primitiveMapping("sm"),
        md: primitiveMapping("base"),
        lg: primitiveMapping("lg")
    }
};

type SemanticToPrimitiveGrouped = typeof semanticToPrimitiveGrouped;
type KeysOfUnion<T> = T extends unknown ? keyof T : never;
export type SemanticToken = KeysOfUnion<{
    [R in keyof SemanticToPrimitiveGrouped]: {
        [S in `type-${R}-${keyof (SemanticToPrimitiveGrouped[R]) & string}`]: S
    };
}[keyof SemanticToPrimitiveGrouped]>;

export type SemanticToPrimitiveMap = Record<SemanticToken, PrimitiveMapping>;
export const SemanticToPrimitiveMap = Object.fromEntries(Object
    .entries(semanticToPrimitiveGrouped)
    .flatMap(([role, sizes]) => Object
        .entries(sizes)
        .map(([size, tokens]) => [`type-${role}-${size}`, tokens])
    )
) as SemanticToPrimitiveMap;


export type SemanticMapping = {
    semanticToken: SemanticToken;
    primitiveOverrides?: Partial<PrimitiveMapping>;
};
function semanticMapping(semanticToken: SemanticToken, primitiveOverrides: SemanticMapping["primitiveOverrides"] = {}): SemanticMapping {
    return {semanticToken, primitiveOverrides};
}
// Context tokens: where the text sits in the page's content structure -> semantic token,
// with optional primitive tokens overriding individual properties.
// Deliberately generic ("section", "item", "hero"), never tied to a single component.
export const ContextToSemanticMap = {
    "hero-heading": semanticMapping("type-display-sm"),
    "section-title": semanticMapping("type-heading-xl"),
    "section-subtitle": semanticMapping("type-heading-md"),
    "item-title": semanticMapping("type-heading-lg"),
    "item-subtitle": semanticMapping("type-heading-sm"),
    "logo-text": semanticMapping("type-body-lg", {fontWeight: "medium"})
};
export type ContextToSemanticMap = typeof ContextToSemanticMap;
export type ContextualToken = keyof ContextToSemanticMap;