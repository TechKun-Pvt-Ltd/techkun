import type {CSSDeclarations, CSSValue} from "./types.ts";

export type CSSRules = {
    [selector: string]: {
        [P in CSSProperty]?: CSSValue;
    };
};

export interface TypeTokensLayer {
    getCSSDeclarations(): CSSDeclarations | null;
    getCSSRules(): CSSRules | null;
}

// Token families: each one is a set of tokens (the names a mapping can pick from) plus the CSS properties every
// token of the family sets.
const TokenFamilies = {
    typeSize: {
        tokens: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
        cssProperties: ["font-size", "line-height", "letter-spacing"]
    },
    weight: {
        tokens: ["regular", "medium", "semibold", "bold"],
        cssProperties: ["font-weight"]
    }
} as const satisfies Record<string, {tokens: readonly string[]; cssProperties: readonly string[]}>;
export type TokenFamily = keyof typeof TokenFamilies;
export type TokenOf<F extends TokenFamily> = typeof TokenFamilies[F]["tokens"][number];
export type CSSPropertiesOf<F extends TokenFamily> = typeof TokenFamilies[F]["cssProperties"][number];
export type CSSProperty = CSSPropertiesOf<TokenFamily>;
export type TypeSizeToken = TokenOf<"typeSize">;
export type WeightToken = TokenOf<"weight">;

export type CSSPropertyValues<F extends TokenFamily = TokenFamily> = {
    [CP in CSSPropertiesOf<F>]: CSSValue;
};
export type PrimitiveValues = {
    [F in TokenFamily]: {
        [T in TokenOf<F>]: CSSPropertyValues<F>;
    };
};

export type PrimitiveMapping = {
    [F in TokenFamily]: TokenOf<F>;
};
function primitiveMapping(typeSizeToken: TypeSizeToken, weightToken: WeightToken = "regular"): PrimitiveMapping {
    return {typeSize: typeSizeToken, weight: weightToken};
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

type Grouped = typeof semanticToPrimitiveGrouped;
export type SemanticToken = {
    [R in keyof Grouped & string]: `type-${R}-${keyof Grouped[R] & string}`
}[keyof Grouped & string];

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
function semanticMapping(semanticToken: SemanticToken, primitiveOverrides?: SemanticMapping["primitiveOverrides"]): SemanticMapping {
    return {semanticToken, primitiveOverrides};
}
// Context tokens: where the text sits in the page's content structure -> semantic token,
// with optional primitive tokens overriding individual properties.
// Deliberately generic ("section", "item", "hero"), never tied to a single component.
export const ContextualToSemanticMap = {
    "hero-heading": semanticMapping("type-display-sm"),
    "section-title": semanticMapping("type-heading-xl"),
    "section-subtitle": semanticMapping("type-heading-md"),
    "item-title": semanticMapping("type-heading-lg"),
    "item-subtitle": semanticMapping("type-heading-sm"),
    "logo-text": semanticMapping("type-body-lg", {weight: "medium"})
};
export type ContextualToSemanticMap = typeof ContextualToSemanticMap;
export type ContextualToken = keyof ContextualToSemanticMap;