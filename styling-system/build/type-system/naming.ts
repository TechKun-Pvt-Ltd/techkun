import type {ComponentToken, PrimitiveTokenVariant, ProxyProperty, SemanticToken} from "./schema/lookups.ts";
import {
    type AliasCustomProperties,
    buildAliasCustomProperties,
    buildPrimitiveCustomProperties,
    type PrimitiveCustomProperties
} from "./schema/shapes.ts";
import {toVarRefs} from "../shared/utils.ts";

/* Naming only: the CSS custom property each token sets each of its CSS properties through, how they're
   referenced, and the utility selector each token gets. A primitive token sets only the CSS properties of its
   proxy property; alias (semantic and component) tokens set them all. */

const SEMANTIC_PREFIX = "type";

export const primitiveCustomProperties: PrimitiveCustomProperties = buildPrimitiveCustomProperties(
    (variant, cssProperty) => `--${cssProperty}-${variant}`
);

export const aliasCustomProperties: AliasCustomProperties = buildAliasCustomProperties(
    (token, cssProperty) => `--${SEMANTIC_PREFIX}-${token}-${cssProperty}`,
    (token, cssProperty) => `--${token}-${cssProperty}`
);

export function standaloneProperty<S extends string>(standalone: S) {
    return `--${standalone}` as const;
}

export function primitiveVars<P extends ProxyProperty>(proxyProperty: P, variant: PrimitiveTokenVariant<P>) {
    return toVarRefs(primitiveCustomProperties[proxyProperty][variant]);
}

export function aliasVars(token: keyof AliasCustomProperties) {
    return toVarRefs(aliasCustomProperties[token]);
}

/* A proxy property left out gets no primitive utilities - type sizes are only reachable through semantic
   tokens. */
export const primitiveUtilitySelectors = {
    weight: variant => `.font-${variant}`
} as const satisfies { [P in ProxyProperty]?: (variant: PrimitiveTokenVariant<P>) => string };

export function semanticUtilitySelector(token: SemanticToken) {
    return `.${SEMANTIC_PREFIX}-${token}` as const;
}

export function componentUtilitySelector(token: ComponentToken) {
    return `.${token}` as const;
}
