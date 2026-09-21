import {mapObjectEntries, toVarRefs} from "./shared.ts";
import type {CSSProperty, CSSPropertyValues, SemanticToken, TypeTokensLayer} from "./config.ts";
import type {CSSToken, CSSValue} from "./types.ts";

/* Semantic tokens: type roles (display, heading, body), each mapped onto primitive tokens. */

export interface SemanticTypeTokensLayer extends TypeTokensLayer {
    resolveSemanticToken(semanticToken: SemanticToken): { [CP in CSSProperty]: CSSValue; };
}
export default function getSemanticLayer(semanticValues: Record<SemanticToken, CSSPropertyValues>): SemanticTypeTokensLayer {
    const cssTokenLookup = mapObjectEntries(semanticValues, (semanticToken, values) => [
        semanticToken,
        mapObjectEntries(values, cssProperty => [cssProperty, `--${semanticToken}-${cssProperty}` as CSSToken])
    ]);
    return {
        resolveSemanticToken(semanticToken) {
            return toVarRefs(cssTokenLookup[semanticToken]);
        },
        getCSSDeclarations() {
            return Object.fromEntries(Object.entries(cssTokenLookup)
                .flatMap(([semanticToken, cssTokens]) => Object.entries(cssTokens)
                    .map(([cssProperty, cssToken]) => [
                        cssToken, semanticValues[semanticToken as SemanticToken][cssProperty as CSSProperty]
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