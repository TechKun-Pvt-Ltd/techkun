import type {PrimitiveMapping, SemanticMapping} from "./types.ts";
import type {TypeSizeToken, WeightToken} from "./schema.ts";

function primitiveMapping(typeSizeToken: TypeSizeToken, weightToken: WeightToken = "regular"): PrimitiveMapping {
    return {typeSize: typeSizeToken, weight: weightToken};
}
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
} satisfies { [role: string]: { [key: string]: PrimitiveMapping } };

function semanticMapping(semanticToken: SemanticToken, primitiveOverrides?: SemanticMapping["primitiveOverrides"]): SemanticMapping {
    return {semanticToken, primitiveOverrides};
}
export const ContextualToSemanticMap = {
    "hero-heading": semanticMapping("type-display-sm"),
    "section-title": semanticMapping("type-heading-xl"),
    "section-subtitle": semanticMapping("type-heading-md"),
    "item-title": semanticMapping("type-heading-lg"),
    "item-subtitle": semanticMapping("type-heading-sm"),
    "logo-text": semanticMapping("type-body-lg", {weight: "medium"})
} satisfies { [key: string]: SemanticMapping };


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
export const SemanticTokens = Object.keys(SemanticToPrimitiveMap) as SemanticToken[];


export type ContextualToSemanticMap = typeof ContextualToSemanticMap;
export type ContextualToken = keyof ContextualToSemanticMap;