import {flatten, semanticTokens} from "./schema.ts";
import type {AliasTokenRef, ContextualMapping, PrimitiveTokenRef, SemanticMapping, SemanticToken, TokenOf} from "./schema.ts";

const semanticMappingGrouped: SemanticMapping = {
    display: {
        sm: primitive("5xl")
    },
    heading: {
        sm: primitive("xl"),
        md: primitive("2xl"),
        lg: primitive("3xl"),
        xl: primitive("4xl")
    },
    body: {
        sm: primitive("sm"),
        md: primitive("base"),
        lg: primitive("lg")
    }
};

export const contextualMapping: ContextualMapping = {
    "hero-heading": alias(semanticTokens.display.sm),
    "section-title": alias(semanticTokens.heading.xl),
    "section-subtitle": alias(semanticTokens.heading.md),
    "item-title": alias(semanticTokens.heading.lg),
    "item-subtitle": alias(semanticTokens.heading.sm),
    "logo-text": alias(semanticTokens.body.lg, {weight: "medium"})
};

function primitive(typeSize: TokenOf<"type-size">, weight: TokenOf<"weight"> = "regular"): PrimitiveTokenRef {
    return {"type-size": typeSize, weight};
}
function alias(tokenRef: SemanticToken, primitiveOverrides?: AliasTokenRef["primitiveOverrides"]): AliasTokenRef {
    return {tokenRef, primitiveOverrides};
}

export const semanticMapping = flatten(semanticTokens, semanticMappingGrouped);
