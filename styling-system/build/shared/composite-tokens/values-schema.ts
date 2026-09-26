import type {
    FormatToken,
    GetCSSPropertyOf,
    GetPrimitiveToken,
    GetPrimitiveTokenLookup,
    GetPrimitiveTokenVariant,
    GetProxyProperty,
    SchemaShape
} from "./schema-shape.ts";
import type {CSSValue} from "../types.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";

export type GetGroupedPrimitiveValues<S extends SchemaShape> = {
    [P in GetProxyProperty<S>]: {
        [V in GetPrimitiveTokenVariant<S, P>]: {
            [CP in GetCSSPropertyOf<S, P>]: CSSValue
        }
    }
};

// A primitive token's values set only its own proxy property's CSS properties.
type GetPrimitiveValuesOf<S extends SchemaShape, T extends GetPrimitiveToken<S>> = {
    [P in GetProxyProperty<S>]: T extends FormatToken<P & string, GetPrimitiveTokenVariant<S, P>> ? { [CP in GetCSSPropertyOf<S, P>]: CSSValue } : never
}[GetProxyProperty<S>];
export type GetPrimitiveValues<S extends SchemaShape> ={ [T in GetPrimitiveToken<S>]: GetPrimitiveValuesOf<S, T> };

export function getPrimitiveValuesFlattener<S extends SchemaShape>(primitiveTokens: GetPrimitiveTokenLookup<S>) {
    return (values: GetGroupedPrimitiveValues<S>) => ObjectStream.of(primitiveTokens)
        .flatMap((proxyProperty, variants) => ObjectStream.of(variants)
            .mapEntries<GetPrimitiveToken<S>, unknown>((variant, token) => [
                token, (values[proxyProperty] as Record<string, unknown>)[variant]
            ])
        )
        .collect() as GetPrimitiveValues<S>;
}
