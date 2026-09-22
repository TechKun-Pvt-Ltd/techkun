import {toVarRefs} from "./utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {SemanticToken} from "./mapping.ts";
import type {CSSToken, CSSValue, TypeTokensLayer} from "./types.ts";
import type {CSSProperty, CSSPropertyValues} from "./schema.ts";

/* Semantic tokens: type roles (display, heading, body), each mapped onto primitive tokens. */

export interface SemanticTypeTokensLayer extends TypeTokensLayer {
    resolveSemanticToken(semanticToken: SemanticToken): { [CP in CSSProperty]: CSSValue; };
}
export default function getSemanticLayer(semanticValues: Record<SemanticToken, CSSPropertyValues>): SemanticTypeTokensLayer {
    const cssTokenLookup = ObjectStream.of(semanticValues)
        .mapEntryToValue((semanticToken, values) => ObjectStream
            .of(values)
            .mapKeyToValue(cssProperty => `--${semanticToken}-${cssProperty}` as CSSToken)
            .collect()
        )
        .collect();
    return {
        resolveSemanticToken(semanticToken) {
            return toVarRefs(cssTokenLookup[semanticToken]);
        },
        getCSSTokenDeclarations() {
            return ObjectStream.of(cssTokenLookup)
                .flatMap((semanticToken, cssTokens) => ObjectStream
                    .of(cssTokens)
                    .mapEntries((cssProperty, cssToken) => [cssToken, semanticValues[semanticToken][cssProperty]])
                )
                .collect();
        },
        getCSSRules() {
            return ObjectStream.of(cssTokenLookup)
                .mapEntries((token, cssTokens) => [`.${token}`, toVarRefs(cssTokens)])
                .collect();
        }
    };
}