import {
    type AliasCustomProperties,
    buildAliasCustomProperties,
    buildPrimitiveCustomProperties,
    type PrimitiveCustomProperties
} from "./schema.ts";

/* Naming only: which CSS custom property each token sets each of its CSS properties through. A primitive
   token sets only the CSS properties of its proxy property; alias (semantic and contextual) tokens set them all. */

export const primitiveCustomProperties: PrimitiveCustomProperties = buildPrimitiveCustomProperties(
    (variant, cssProperty) => `--${cssProperty}-${variant}`
);

export const aliasCustomProperties: AliasCustomProperties = buildAliasCustomProperties(
    (token, cssProperty) => `--type-${token}-${cssProperty}`,
    (token, cssProperty) => `--${token}-${cssProperty}`
);