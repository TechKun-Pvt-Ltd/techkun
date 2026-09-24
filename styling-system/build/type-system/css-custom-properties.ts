import {AliasProperties, ContextualTokensList, primitiveTokens, SemanticTokensList} from "./schema.ts";
import type {AliasToken, CSSProperty, PrimitiveToken} from "./schema.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import {createObjectFromEntries} from "../shared/utils.ts";
import type {CSSToken} from "../shared/types.ts";

/* Naming only: which CSS custom property each token sets each of its CSS properties through. A primitive
   token sets only the CSS properties of its alias property; alias (semantic and contextual) tokens set them all. */

export type PrimitiveCustomProperties = { [T in PrimitiveToken]: { [CP in CSSProperty]?: CSSToken } };
export type AliasCustomProperties = { [T in AliasToken]: { [CP in CSSProperty]: CSSToken } };

const CSSProperties: CSSProperty[] = Object.values(AliasProperties).flat();

export const primitiveCustomProperties = ObjectStream.of(primitiveTokens)
    .flatMap((aliasProperty, tokens) => ObjectStream.of(tokens)
        .mapEntries((token, flatToken) => [
            flatToken,
            createObjectFromEntries(AliasProperties[aliasProperty].map(cssProperty => [cssProperty, `--${cssProperty}-${token}` as const]))
        ])
    )
    .collect() as PrimitiveCustomProperties;

function aliasCustomPropertiesOf<T extends AliasToken>(tokens: T[], naming: (token: T, cssProperty: CSSProperty) => CSSToken) {
    return createObjectFromEntries(tokens.map(token => [
        token,
        createObjectFromEntries(CSSProperties.map(cssProperty => [cssProperty, naming(token, cssProperty)]))
    ]));
}
export const aliasCustomProperties: AliasCustomProperties = {
    ...aliasCustomPropertiesOf(SemanticTokensList, (token, cssProperty) => `--type-${token}-${cssProperty}`),
    ...aliasCustomPropertiesOf(ContextualTokensList, (token, cssProperty) => `--${token}-${cssProperty}`)
};
