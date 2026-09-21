import {mapObjectEntries, mapObjectValues} from "./shared.ts";
import type {Property, TokensByProperty, TypeTokensLayer} from "./shared.ts";
import {resolvePrimitiveToken} from "./primitive-layer.ts";
import type {SemanticToken} from "./semantic-layer.ts";
import {resolveSemanticToken} from "./semantic-layer.ts";

/* Context tokens: where the text sits in the page's content structure. They declare no custom
   properties of their own, only rules that resolve to semantic (and overriding primitive) variables. */

type ContextMapping = {
    semanticToken: SemanticToken;
    primitiveOverrides: {
        [P in Property]?: TokensByProperty[P]
    };
};

function contextMapping(semanticToken: SemanticToken, primitiveOverrides: ContextMapping["primitiveOverrides"] = {}): ContextMapping {
    return {semanticToken, primitiveOverrides};
}
// Context tokens: where the text sits in the page's content structure -> semantic token,
// with optional primitive tokens overriding individual properties.
// Deliberately generic ("section", "item", "hero"), never tied to a single component.
const CONTEXT_TO_SEMANTIC = {
    "hero-heading": contextMapping("type-display-sm"),
    "section-title": contextMapping("type-heading-xl"),
    "section-subtitle": contextMapping("type-heading-md"),
    "item-title": contextMapping("type-heading-lg"),
    "item-subtitle": contextMapping("type-heading-sm"),
    "logo-text": contextMapping("type-body-lg", {fontWeight: "medium"})
};
// type ContextToken = keyof typeof CONTEXT_TO_SEMANTIC;

// Context tokens resolve to their semantic token's `var()` references, with primitive overrides applied on top.
function resolveMapping(mapping: typeof CONTEXT_TO_SEMANTIC) {
    const overrides = mapObjectValues(
        mapping,
        ({primitiveOverrides}) =>
            mapObjectEntries(
                primitiveOverrides,
                (property, token) => [property, resolvePrimitiveToken(property, token)]
            )
    );
    return mapObjectEntries(mapping, (token, {semanticToken}) => {
        return [token, {...resolveSemanticToken(semanticToken), ...overrides[token]}];
    });
}
const ContextLayer: TypeTokensLayer = {
    getCSSDeclarations() {
        return null;
    },
    getCSSRules() {
        return mapObjectEntries(
            resolveMapping(CONTEXT_TO_SEMANTIC),
            (token, values) => [`.${token}`, values]
        );
    }
};
export default ContextLayer;