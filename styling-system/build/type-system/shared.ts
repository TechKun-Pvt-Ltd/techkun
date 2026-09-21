import type {CSSPropertiesOf, TokenFamily} from "./config.ts";
import type {CSSToken, CSSValue} from "./types.ts";

/* Everything the token levels (primitives, semantic, context) have in common.
   Primitives are tied to a token family, so their objects are keyed by property first: `object[property][token]`.
   Semantic and context tokens are tied to intent, so their objects are keyed by token first: `object[token][property]`. */

export function toVarRefs<F extends TokenFamily = TokenFamily>(
    cssPropertyValues: Record<CSSPropertiesOf<F>, CSSToken>
): {[K in CSSPropertiesOf<F>]: CSSValue} {
    return mapObjectValues(cssPropertyValues, name => `var(${name})`);
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
export function mapObjectEntries<O extends object, U extends keyof any, V>(
    object: O, mapper: (key: keyof O, value: O[keyof O]) => [U, V]
): { [P in U]: V } {
    return Object.fromEntries(Object.entries(object)
        .map(([key, value]) => mapper(key as keyof O, value))) as any;
}
export function mapObjectValues<O extends object, V>(
    object: O, mapper: (value: O[keyof O]) => V
): { [P in keyof O]: V } {
    return Object.fromEntries(Object.entries(object)
        .map(([key, value]) => [key, mapper(value)])) as any;
}
export function mapObjectKeys<O extends object, U extends keyof any>(
    object: O, mapper: (value: keyof O) => U
): { [P in U]: O[keyof O] } {
    return Object.fromEntries(Object.entries(object)
        .map(([key, value]) => [mapper(key as keyof O), value])) as any;
}