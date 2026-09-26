import {
    type CSSProperty, type PrimitiveCustomProperties,
    type PrimitiveToken,
    primitiveTokens,
    primitiveTokensList,
    type PrimitiveValues,
    propertyProxyMap,
    type PropertyProxyMap
} from "./schema.ts";
import primitiveValues, {standaloneValues} from "./primitive-values.ts";
import {contextualMapping, semanticMapping} from "./mapping.ts";
import {
    aliasCustomProperties,
    primitiveCustomProperties
} from "./css-custom-properties.ts";
import {getAliasTokenRefResolver, getPrimitiveTokenRefResolver} from "../shared/composite-tokens/mapping-schema.ts";
import {createObjectFromEntries, mergeAll} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSCustomProperty, CSSCustomPropertyDeclarations, CSSValue} from "../shared/types.ts";

/* Declarations: pair each token's custom properties with its values. Primitive values are the generated ones;
   alias values are var() references to whatever custom properties their mapping points at. Standalone values
   aren't tokens, so their CSS names are paired with them here directly. */

const resolvePrimitiveTokenRef = getPrimitiveTokenRefResolver(primitiveTokens, primitiveCustomProperties);
const resolveAliasTokenRef = getAliasTokenRefResolver(resolvePrimitiveTokenRef, aliasCustomProperties);

function getPrimitiveCssDeclarationsBuilder(
    primitiveTokensList: PrimitiveToken[],
    propertyProxyMap: PropertyProxyMap
) {
    const cssProperties: CSSProperty[] = Object.values(propertyProxyMap).flat();
    // Grouped by CSS property: every font-size, then every line-height, and so on.
    return (
        primitiveCustomProperties: PrimitiveCustomProperties,
        primitiveValues: PrimitiveValues
    ): CSSCustomPropertyDeclarations => createObjectFromEntries(
        cssProperties.flatMap(cssProperty => primitiveTokensList.flatMap(token => {
            const customProperty = primitiveCustomProperties[token][cssProperty];
            const valuesByCssProperty: { [K in CSSProperty]?: CSSValue; } = primitiveValues[token];
            const value = valuesByCssProperty[cssProperty];
            return customProperty && value ? [[customProperty, value] as const] : [];
        }))
    );
}

const buildPrimitiveCssDeclarations = getPrimitiveCssDeclarationsBuilder(primitiveTokensList, propertyProxyMap);

function pairUp<CP extends string>(
    cssCustomProperties: { [K in CP]: CSSCustomProperty },
    values: { [K in CP]?: CSSValue }
): CSSCustomPropertyDeclarations {
    return ObjectStream.of(cssCustomProperties).mapEntries<CSSCustomProperty, CSSValue>((cssProperty, cssToken) => {
        const value = values[cssProperty];
        if (value === undefined) throw new Error(`No value resolved for ${cssToken}.`);
        return [cssToken, value];
    }).collect();
}

const declarations = mergeAll([
    {
        "--scale-ratio": standaloneValues.scaleRatio,
        "--ls-offset": standaloneValues.letterSpacingOffset
    },
    buildPrimitiveCssDeclarations(primitiveCustomProperties, primitiveValues),
    ObjectStream.of(semanticMapping)
        .flatMap((token, ref) => pairUp(aliasCustomProperties[token], resolvePrimitiveTokenRef(ref)))
        .collect(),
    ObjectStream.of(contextualMapping)
        .flatMap((token, ref) => pairUp(aliasCustomProperties[token], resolveAliasTokenRef(ref)))
        .collect()
]);
export default declarations;