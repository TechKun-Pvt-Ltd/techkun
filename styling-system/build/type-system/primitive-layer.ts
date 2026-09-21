import {
    mapObjectEntries, mapObjectValues, toVarRefs
} from "./shared.ts";
import type {
    CSSPropertiesOf, CSSProperty,
    CSSPropertyValues,
    PrimitiveMapping,
    PrimitiveValues,
    TokenFamily,
    TokenOf, TypeTokensLayer
} from "./config.ts";
import type {CSSToken, CSSValue} from "./types.ts";

export interface PrimitiveTypeTokensLayer extends TypeTokensLayer {
    resolvePrimitiveMapping<PM extends Partial<PrimitiveMapping>>(propertyMapping: PM): { [CP in CSSPropertiesOf<keyof PM & TokenFamily>]: CSSValue; };
}
export default function getPrimitiveLayer(primitiveValues: PrimitiveValues): PrimitiveTypeTokensLayer {
    const primitiveCssTokensLookup: {
        [F in TokenFamily]: {
            [T in TokenOf<F>]: {
                [CP in CSSPropertiesOf<F>]: CSSToken;
            };
        };
    } = mapObjectValues(
        primitiveValues,
        tokenGroupedValues => mapObjectEntries(
            tokenGroupedValues,
            <P extends TokenFamily>(primitiveToken: TokenOf<P>, cssPropertyValues: CSSPropertyValues<P>) => [
                primitiveToken,
                mapObjectEntries(
                    cssPropertyValues,
                    cssProperty => [cssProperty, `--${cssProperty}-${primitiveToken}` as CSSToken]
                )
            ]
        )
    );
    function lookupPrimitiveCssTokens<P extends TokenFamily>(property: P, primitiveToken: TokenOf<P>): { [CP in CSSPropertiesOf<P>]: CSSToken; } {
        return primitiveCssTokensLookup[property][primitiveToken];
    }
    return {
        resolvePrimitiveMapping(mapping) {
            return Object.entries(mapping)
                .map(([property, primitiveToken]) => lookupPrimitiveCssTokens(property as TokenFamily, primitiveToken))
                .map(toVarRefs)
                .reduce((a, b) => Object.assign(a, b), {} as CSSPropertyValues);
        },
        getCSSDeclarations() {
            return Object.fromEntries(Object
                .entries(primitiveValues)
                .flatMap(([property, tokenGroupedValues]) => Object
                    .entries(tokenGroupedValues)
                    .flatMap(([primitiveToken, cssPropertyValues]) => Object
                        .entries(cssPropertyValues)
                        .map(([cssProperty, cssValue]) => [
                            lookupPrimitiveCssTokens(property as TokenFamily, primitiveToken as TokenOf<TokenFamily>)[cssProperty as CSSProperty],
                            cssValue
                        ] as [CSSToken, CSSValue])
                    )
                )
            );
        },
        getCSSRules() {
            return mapObjectEntries(
                primitiveCssTokensLookup.weight,
                (token, propertyName) => [
                    `.font-${token}`, toVarRefs<"weight">(propertyName)
                ]
            );
        }
    };
};