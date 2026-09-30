import {typeSchema} from "../spec.ts";
import type {AliasTokenRef, ComponentMapping, ComponentToken, GroupedSemanticMapping, PrimitiveTokenRef, SemanticToken} from "../system.ts";

const semanticTokens = typeSchema.semantic;

function primitive(typeSize: PrimitiveTokenRef["ref"]["type-size"], weight: PrimitiveTokenRef["ref"]["weight"] = "regular"): PrimitiveTokenRef {
    return {kind: "primitive", ref: {"type-size": typeSize, weight}};
}
function aliasRef<R extends AliasTokenRef>(tokenRef: R["ref"], override?: AliasTokenRef["override"]) {
    return {kind: "alias", ref: tokenRef, override} as R;
}
const semanticRef = {
    primitive,
    alias: aliasRef<AliasTokenRef<SemanticToken>>
};
const componentRef = {
    primitive,
    alias: aliasRef<AliasTokenRef<SemanticToken | ComponentToken>>
};

export const semanticMapping: GroupedSemanticMapping = {
    display: {
        sm: semanticRef.primitive("5xl")
    },
    heading: {
        sm: semanticRef.primitive("xl"),
        md: semanticRef.primitive("2xl"),
        lg: semanticRef.primitive("3xl"),
        xl: semanticRef.primitive("4xl")
    },
    body: {
        sm: semanticRef.primitive("sm"),
        md: semanticRef.primitive("base"),
        lg: semanticRef.primitive("lg")
    }
};

export const componentMapping: ComponentMapping = {
    "hero-heading": componentRef.alias(semanticTokens.display.sm),
    "section-title": componentRef.alias(semanticTokens.heading.xl),
    "section-subtitle": componentRef.alias(semanticTokens.heading.md),
    "item-title": componentRef.alias(semanticTokens.heading.lg),
    "item-subtitle": componentRef.alias(semanticTokens.heading.sm),
    "logo-text": componentRef.alias(semanticTokens.body.lg, {weight: "medium"})
};
