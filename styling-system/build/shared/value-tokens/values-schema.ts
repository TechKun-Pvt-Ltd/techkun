import type {
    GetPrimitiveToken,
    GetPrimitiveTokenGroup,
    GetPrimitiveTokenLookup,
    GetPrimitiveTokenVariant,
    SchemaShape
} from "./schema-shape.ts";
import type {CSSValue} from "../types.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";

export type GetGroupedPrimitiveValues<S extends SchemaShape> = {
    [G in GetPrimitiveTokenGroup<S>]: {
        [V in GetPrimitiveTokenVariant<S, G>]: CSSValue
    }
};
export type GetPrimitiveValues<S extends SchemaShape> = { [T in GetPrimitiveToken<S>]: CSSValue };

export function getPrimitiveValuesFlattener<S extends SchemaShape>(primitiveTokens: GetPrimitiveTokenLookup<S>) {
    return (values: GetGroupedPrimitiveValues<S>) => ObjectStream.of(primitiveTokens)
        .flatMap((group, variants) => ObjectStream.of(variants)
            .mapEntries<GetPrimitiveToken<S>, CSSValue>((variant, token) => [
                token, (values[group] as Record<string, CSSValue>)[variant]
            ])
        )
        .collect() as GetPrimitiveValues<S>;
}
