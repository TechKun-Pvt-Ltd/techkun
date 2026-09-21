import {mapObjectEntries, type CSSValue, toVarRefs} from "./shared.ts";
import type {CSSProperty, TypeTokensLayer, CSSToken} from "./shared.ts";
import type {CSSPropertyValues, SemanticToken} from "./config.ts";

/* Semantic tokens: type roles (display, heading, body), each mapped onto primitive tokens. */

const SEMANTIC_SUFFIX: Record<CSSProperty, string> = {
    "font-size": "size",
    "line-height": "line-height",
    "letter-spacing": "letter-spacing",
    "font-weight": "weight"
};

interface SemanticLayer extends TypeTokensLayer {
    resolveSemanticToken(semanticToken: SemanticToken): { [CP in CSSProperty]: CSSValue; };
}
export default function getSemanticLayer(values: Record<SemanticToken, CSSPropertyValues>): SemanticLayer {
    const cssTokenLookup = mapObjectEntries(values, (semanticToken, values) => [
        semanticToken,
        mapObjectEntries(values, cssProperty => [cssProperty, `--${semanticToken}-${SEMANTIC_SUFFIX[cssProperty]}` as CSSToken])
    ]);
    return {
        resolveSemanticToken(semanticToken) {
            return toVarRefs(cssTokenLookup[semanticToken]);
        },
        getCSSDeclarations() {
            return Object.fromEntries(Object.entries(cssTokenLookup)
                .flatMap(([semanticToken, cssTokens]) => Object.entries(cssTokens)
                    .map(([cssProperty, cssToken]) => [
                        cssToken, values[semanticToken as SemanticToken][cssProperty as CSSProperty]
                    ])
                )
            );
        },
        getCSSRules() {
            return mapObjectEntries(
                cssTokenLookup,
                (token, cssTokens) => [`.${token}`, toVarRefs(cssTokens)]
            );
        }
    };
}