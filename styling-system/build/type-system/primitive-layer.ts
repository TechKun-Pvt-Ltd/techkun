import {toVarRefs} from "./utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSToken, CSSValue, PrimitiveMapping, PrimitiveValues, TypeTokensLayer} from "./types.ts";
import type {CSSProperty, CSSPropertyOf, CSSPropertyValues, TokenFamily, TokenOf} from "./schema.ts";

export interface PrimitiveTypeTokensLayer extends TypeTokensLayer {
    resolvePrimitiveMapping<PM extends Partial<PrimitiveMapping>>(propertyMapping: PM): { [CP in CSSPropertyOf<keyof PM & TokenFamily>]: CSSValue; };
}

type PrimitiveCssTokensLookup = {
    [F in TokenFamily]: {
        [T in TokenOf<F>]: {
            [CP in CSSPropertyOf<F>]: CSSToken;
        };
    };
};
function createPrimitiveCssTokensLookup(primitiveValues: PrimitiveValues): PrimitiveCssTokensLookup {
    const valuesMapper = (tokenGroupedValues: PrimitiveValues[TokenFamily]) => ObjectStream
        .of(tokenGroupedValues)
        .mapEntryToValue((
            primitiveToken,
            cssPropertyValues
        ) => ObjectStream
            .of(cssPropertyValues)
            .mapKeyToValue<CSSToken>(cssProperty => `--${cssProperty}-${primitiveToken}`)
            .collect()
        )
        .collect();
    return ObjectStream.of(primitiveValues)
        .mapValues(valuesMapper)
        .collect();
}
const SORT_ORDER: CSSProperty[] = ["font-size", "line-height", "letter-spacing", "font-weight"];
export default function getPrimitiveLayer(primitiveValues: PrimitiveValues): PrimitiveTypeTokensLayer {
    const primitiveCssTokensLookup = createPrimitiveCssTokensLookup(primitiveValues);
    function lookupPrimitiveCssTokens<F extends TokenFamily>(property: F, primitiveToken: TokenOf<F>): { [CP in CSSPropertyOf<F>]: CSSToken; } {
        return primitiveCssTokensLookup[property][primitiveToken];
    }
    return {
        resolvePrimitiveMapping(mapping) {
            return Object.entries(mapping)
                .map(([property, primitiveToken]) => lookupPrimitiveCssTokens(property as TokenFamily, primitiveToken))
                .map(toVarRefs)
                .reduce((a, b) => Object.assign(a, b), {} as CSSPropertyValues);
        },
        getCSSTokenDeclarations() {
            const groupedByCssProperty = Object.fromEntries(SORT_ORDER.map(p => [p, []] as [CSSProperty, CSSToken[]])) as { [P in CSSProperty]: CSSToken[] };

            const flatMapper = (
                property: TokenFamily,
                tokenGroupedValues: PrimitiveValues[TokenFamily]
            ) => ObjectStream
                .of(tokenGroupedValues)
                .flatMap((primitiveToken, cssPropertyValues) => {
                    const cssTokensByCssProperty = lookupPrimitiveCssTokens(property, primitiveToken);
                    SORT_ORDER.forEach(p => cssTokensByCssProperty[p] && groupedByCssProperty[p].push(cssTokensByCssProperty[p]));

                    return ObjectStream
                        .of(cssPropertyValues)
                        .mapKeys(cssProperty => cssTokensByCssProperty[cssProperty])
                });
            const tokenDeclarations = ObjectStream.of(primitiveValues)
                .flatMap(flatMapper)
                .collect();

            return Object.fromEntries(SORT_ORDER
                .flatMap(p => groupedByCssProperty[p])
                .map(cssToken => [cssToken, tokenDeclarations[cssToken]])
            );
        },
        getCSSRules() {
            return ObjectStream.of(primitiveCssTokensLookup.weight)
                .mapEntries((token, propertyName) => [`.font-${token}`, toVarRefs<"weight">(propertyName)])
                .collect();
        }
    };
};