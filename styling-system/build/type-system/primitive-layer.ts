import {
    mapObjectEntries, type CSSValue, mapObjectValues, toVarRefs
} from "./shared.ts";
import type {
    CSSProperty, CSSToken, TypeTokensLayer
} from "./shared.ts";
import type {
    CSSPropertiesByProperty,
    CSSPropertyValues,
    PrimitiveMapping,
    PrimitiveValues,
    Property,
    PropertyToken
} from "./config.ts";

interface PrimitiveTokensLayer extends TypeTokensLayer {
    resolvePrimitiveToken(propertyMapping: Partial<PrimitiveMapping>): { [CP in CSSProperty]: CSSValue; };
}
export default function getPrimitiveLayer(values: PrimitiveValues): PrimitiveTokensLayer {
    const primitiveCssTokensLookup: {
        [P in Property]: {
            [T in PropertyToken<P>]: {
                [CP in CSSPropertiesByProperty<P>]: CSSToken;
            };
        };
    } = mapObjectValues(
        values,
        tokenGroupedValues => mapObjectEntries(
            tokenGroupedValues,
            <P extends Property>(primitiveToken: PropertyToken<P>, cssPropertyValues: CSSPropertyValues<P>) => [
                primitiveToken,
                mapObjectEntries(
                    cssPropertyValues,
                    cssProperty => [
                        cssProperty, (primitiveToken === "base" ? `--${primitiveToken}-${cssProperty}`: `--${cssProperty}-${primitiveToken}`) as CSSToken
                    ]
                )
            ]
        )
    );
    function lookupPrimitiveCssTokens<P extends Property>(property: P, primitiveToken: PropertyToken<P>): { [CP in CSSPropertiesByProperty<P>]: CSSToken; } {
        return primitiveCssTokensLookup[property][primitiveToken];
    }
    return {
        resolvePrimitiveToken(mapping) {
            return Object.entries(mapping)
                .map(([property, primitiveToken]) => lookupPrimitiveCssTokens(property as Property, primitiveToken))
                .map(toVarRefs)
                .reduce((a, b) => Object.assign(a, b), {} as CSSPropertyValues);
        },
        getCSSDeclarations() {
            return Object.fromEntries(Object
                .entries(values)
                .flatMap(([property, tokenGroupedValues]) => Object
                    .entries(tokenGroupedValues)
                    .flatMap(([primitiveToken, cssPropertyValues]) => Object
                        .entries(cssPropertyValues)
                        .map(([cssProperty, cssValue]) => [
                            lookupPrimitiveCssTokens(property as Property, primitiveToken as PropertyToken<Property>)[cssProperty as CSSProperty],
                            cssValue
                        ] as [CSSToken, CSSValue])
                    )
                )
            );
        },
        getCSSRules() {
            return mapObjectEntries(
                primitiveCssTokensLookup.fontWeight,
                (token, propertyName) => [
                    `.font-${token}`, toVarRefs<"fontWeight">(propertyName)
                ]
            );
        }
    };
};