import type {CSSToken, CSSValue} from "./types.ts";
import type {CSSPropertyOf, TokenFamily} from "./schema.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

/* Everything the token levels (primitives, semantic, context) have in common.
   Primitives are tied to a token family, so their objects are keyed by property first: `object[property][token]`.
   Semantic and context tokens are tied to intent, so their objects are keyed by token first: `object[token][property]`. */

export function toVarRefs<F extends TokenFamily = TokenFamily>(
    cssPropertyValues: {[K in CSSPropertyOf<F>]: CSSToken}
) {
    return ObjectStream.of(cssPropertyValues)
        .mapValues<CSSValue>(name => `var(${name})`)
        .collect();
}
/* Merges records left to right, skipping nulls. A key defined by more than one record is a mistake
   (a token would silently override another), so it throws instead. */
export function mergeAll<T extends object>(records: (T | null)[]): T {
    const merged: Record<string, unknown> = {};
    for (const record of records) {
        if (record === null) continue;
        for (const [key, value] of Object.entries(record)) {
            if (Object.hasOwn(merged, key)) throw new Error(`Duplicate key "${key}" while merging type-system tokens.`);
            merged[key] = value;
        }
    }
    return merged as T;
}