import type {PrimitiveMapping, SemanticMapping, TypeSizeToken, WeightToken} from "./types.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

const SemanticToPrimitiveGrouped = {
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

const ContextualToSemantic = {
    "hero-heading": semanticMapping("type-display-sm"),
    "section-title": semanticMapping("type-heading-xl"),
    "section-subtitle": semanticMapping("type-heading-md"),
    "item-title": semanticMapping("type-heading-lg"),
    "item-subtitle": semanticMapping("type-heading-sm"),
    "logo-text": semanticMapping("type-body-lg", {weight: "medium"})
} satisfies { [key: string]: SemanticMapping };

function primitiveMapping(typeSizeToken: TypeSizeToken, weightToken: WeightToken = "regular"): PrimitiveMapping {
    return {typeSize: typeSizeToken, weight: weightToken};
}
function semanticMapping(semanticToken: SemanticToken, primitiveOverrides?: SemanticMapping["primitiveOverrides"]): SemanticMapping {
    return {semanticToken, primitiveOverrides};
}
type Grouped = typeof SemanticToPrimitiveGrouped;


export type SemanticToken = {
    [R in keyof Grouped & string]: `type-${R}-${keyof Grouped[R] & string}`
}[keyof Grouped & string];
export type SemanticToPrimitiveMap = { [K in SemanticToken]: PrimitiveMapping; };

export type ContextualToken = keyof typeof ContextualToSemantic;
export type ContextualToSemanticMap = { [K in ContextualToken]: SemanticMapping; };

export const SemanticToPrimitiveMap: SemanticToPrimitiveMap = ObjectStream
    .of(SemanticToPrimitiveGrouped)
    .flatMap((role, sizes) => ObjectStream
        .of(sizes)
        .mapKeys(size => `type-${role}-${size}`)
    )
    .collect();
export const ContextualToSemanticMap: ContextualToSemanticMap = ContextualToSemantic;

export const SemanticTokens = Object.keys(SemanticToPrimitiveMap) as SemanticToken[];