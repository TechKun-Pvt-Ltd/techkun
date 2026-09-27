import {semanticTokens} from "../schema/lookups.ts";
import {flattenSemanticMapping } from "../schema/shapes.ts";
import type {PrimitiveTokenRef, AliasTokenRef, ComponentMapping, ComponentMappingTokenRef, GroupedSemanticMapping, SemanticMappingTokenRef} from "../schema/shapes.ts";

function primitive(typeSize: PrimitiveTokenRef["ref"]["type-size"], weight: PrimitiveTokenRef["ref"]["weight"] = "regular"): PrimitiveTokenRef {
    return {kind: "primitive", ref: {"type-size": typeSize, weight}};
}
function aliasRef<R extends ComponentMappingTokenRef>(tokenRef: R["ref"], override?: AliasTokenRef["override"]) {
    return {kind: "alias", ref: tokenRef, override} as R;
}
const semanticRef = {
    primitive,
    alias: aliasRef<SemanticMappingTokenRef>
};
const componentRef = {
    primitive,
    alias: aliasRef<ComponentMappingTokenRef>
};

const semanticMappingGrouped: GroupedSemanticMapping = {
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

export const semanticMapping = flattenSemanticMapping(semanticMappingGrouped);
