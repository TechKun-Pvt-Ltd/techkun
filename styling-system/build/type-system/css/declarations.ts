import {
    propertyProxyMap,
    type PrimitiveTokenVariant,
    type ProxyProperty
} from "../schema/lookups.ts";
import primitiveValues from "../content/primitives.ts";
import {standalones} from "../content/standalones.ts";
import {componentMapping, semanticMapping} from "../content/mapping.ts";
import {
    aliasCustomProperties,
    primitiveCustomProperties,
    standaloneProperty
} from "../naming.ts";
import {
    getTokenRefResolver
} from "../../shared/composite-tokens/schema-shape.ts";
import {createObjectFromEntries, mergeAll, toVarRefs} from "../../shared/utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import type {CSSCustomProperty, CSSCustomPropertyDeclarations, CSSValue} from "../../shared/types.ts";

/* Declarations: pair each token's custom properties with its values. Primitive values are the generated ones;
   alias values are var() references to whatever custom properties their mapping points at. Standalone values
   aren't tokens, so they're declared by their standalone property name. */

const resolveTokenRef = getTokenRefResolver(primitiveCustomProperties, aliasCustomProperties);

const standaloneCssDeclarations: CSSCustomPropertyDeclarations = ObjectStream.of(standalones)
    .mapKeys(standaloneProperty)
    .collect();

// Grouped by CSS property: every font-size, then every line-height, and so on.
function primitiveCssDeclarationsOf<P extends ProxyProperty>(proxyProperty: P): CSSCustomPropertyDeclarations {
    const customProperties = primitiveCustomProperties[proxyProperty];
    const values = primitiveValues[proxyProperty];
    const variants = Object.keys(customProperties) as PrimitiveTokenVariant<P>[];
    return createObjectFromEntries(propertyProxyMap[proxyProperty].flatMap(cssProperty => variants.map(variant => [
        customProperties[variant][cssProperty], values[variant][cssProperty]
    ] as const)));
}

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

export const declarations = mergeAll([
    standaloneCssDeclarations,
    ...(Object.keys(propertyProxyMap) as ProxyProperty[]).map(primitiveCssDeclarationsOf),
    ObjectStream.of(semanticMapping)
        .flatMap((token, ref) => pairUp(aliasCustomProperties[token], toVarRefs(resolveTokenRef(ref))))
        .collect(),
    ObjectStream.of(componentMapping)
        .flatMap((token, ref) => pairUp(aliasCustomProperties[token], toVarRefs(resolveTokenRef(ref))))
        .collect()
]);
