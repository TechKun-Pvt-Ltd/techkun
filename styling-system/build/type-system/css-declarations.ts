import {AliasProperties, PrimitiveTokensList, primitiveTokens} from "./schema.ts";
import type {AliasProperty, CSSProperty, PrimitiveToken, PrimitiveTokenRef} from "./schema.ts";
import primitiveValues, {standaloneValues} from "./primitive-values.ts";
import {contextualMapping, semanticMapping} from "./mapping.ts";
import {aliasCustomProperties, primitiveCustomProperties} from "./css-custom-properties.ts";
import {createObjectFromEntries, toVarRefs} from "../shared/utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSToken, CSSTokenDeclarations, CSSValue} from "../shared/types.ts";

/* Declarations: pair each token's custom properties with its values. Primitive values are the generated ones;
   alias values are var() references to whatever custom properties their mapping points at. Standalone values
   aren't tokens, so their CSS names are paired with them here directly. */

export const standaloneCssDeclarations: CSSTokenDeclarations = {
    "--scale-ratio": standaloneValues.scaleRatio,
    "--ls-offset": standaloneValues.letterSpacingOffset
};

// Grouped by CSS property: every font-size, then every line-height, and so on.
export const primitiveCssDeclarations: CSSTokenDeclarations = createObjectFromEntries(
    Object.values(AliasProperties).flat().flatMap(cssProperty => PrimitiveTokensList.flatMap(token => {
        const cssToken = primitiveCustomProperties[token][cssProperty];
        return cssToken ? [[cssToken, (primitiveValues[token] as Record<CSSProperty, CSSValue>)[cssProperty]] as const] : [];
    }))
);

function resolvePrimitiveTokenRef(ref: Partial<PrimitiveTokenRef>): { [CP in CSSProperty]?: CSSValue } {
    return Object.assign({}, ...(Object.entries(ref) as [AliasProperty, string][])
        .map(([aliasProperty, token]) => toVarRefs(primitiveCustomProperties[(primitiveTokens[aliasProperty] as Record<string, PrimitiveToken>)[token]]))
    );
}
function pairUp(cssTokens: { [CP in CSSProperty]: CSSToken }, values: { [CP in CSSProperty]?: CSSValue }): CSSTokenDeclarations {
    return ObjectStream.of(cssTokens).mapEntries((cssProperty, cssToken) => {
        const value = values[cssProperty];
        if (value === undefined) throw new Error(`No value resolved for ${cssToken}.`);
        return [cssToken, value];
    }).collect();
}

export const semanticCssDeclarations: CSSTokenDeclarations = ObjectStream.of(semanticMapping)
    .flatMap((token, ref) => pairUp(aliasCustomProperties[token], resolvePrimitiveTokenRef(ref)))
    .collect();

export const contextualCssDeclarations: CSSTokenDeclarations = ObjectStream.of(contextualMapping)
    .flatMap((token, {tokenRef, primitiveOverrides}) => pairUp(aliasCustomProperties[token], {
        ...toVarRefs(aliasCustomProperties[tokenRef]),
        ...resolvePrimitiveTokenRef(primitiveOverrides ?? {})
    }))
    .collect();
