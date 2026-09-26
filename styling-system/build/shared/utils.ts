import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSCustomProperty, CSSValue} from "./types.ts";

// type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
//     ? `${Head extends Lowercase<Head> ? Head : `-${Lowercase<Head>}`}${KebabCase<Tail>}`
//     : S;
// function kebabCase<S extends string>(s: S): KebabCase<S> {
//     return s.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`) as KebabCase<S>;
// }

/* Helpers every token system (type-system, color-system) builds its CSS with. Nothing here knows about any
   one system's tokens - only about CSS custom properties, values and the records that hold them. */

export function createObjectFromEntries<K extends keyof any, V>(entries: Iterable<readonly [K, V]>): { [P in K]: V; } {
    return Object.fromEntries(entries) as any;
}

export function toVarRef(cssToken: CSSCustomProperty): CSSValue {
    return `var(${cssToken})`;
}
export function toVarRefs<T extends {[key: string]: CSSCustomProperty}>(
    cssCustomProperties: T
): { [K in keyof T]: CSSValue } {
    return ObjectStream.of(cssCustomProperties)
        .mapValues<CSSValue>(toVarRef)
        .collect();
}
/* Merges records left to right, skipping nulls. A key defined by more than one record is a mistake
   (a token would silently override another), so it throws instead. */
export function mergeAll<T extends object>(records: (T | null)[]): T {
    const merged: Record<string, unknown> = {};
    for (const record of records) {
        if (record === null) continue;
        for (const [key, value] of Object.entries(record)) {
            if (Object.hasOwn(merged, key)) throw new Error(`Duplicate key "${key}" while merging token records.`);
            merged[key] = value;
        }
    }
    return merged as T;
}
