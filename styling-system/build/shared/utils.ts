import {ObjectStream} from "../../../lib/object-stream.ts";
import type {CSSCustomProperty, CSSValue} from "./types.ts";

type HyphenateCapitals<S extends string> = S extends `${infer Head}${infer Tail}`
    ? `${Head extends Lowercase<Head> ? Head : `-${Lowercase<Head>}`}${HyphenateCapitals<Tail>}`
    : S;
// A leading capital (PascalCase) is only lowercased - there's nothing before it to separate it from.
export type ToKebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
    ? `${Lowercase<Head>}${HyphenateCapitals<Tail>}`
    : S;
export function toKebabCase<S extends string>(s: S): ToKebabCase<S> {
    return s.replace(/[A-Z]/g, (c, offset: number) => offset === 0 ? c.toLowerCase() : `-${c.toLowerCase()}`) as ToKebabCase<S>;
}

/* Helpers every token system (type-system, color-system) builds its CSS with. Nothing here knows about any
   one system's tokens - only about CSS custom properties, values and the records that hold them. */

export function createObjectFromEntries<K extends keyof any, V>(entries: Iterable<readonly [K, V]>): { [P in K]: V; } {
    return Object.fromEntries(entries) as any;
}

export type HyphenJoin<S1 extends string, S2 extends string> = `${S1}-${S2}`;
export function hyphenJoin<S1 extends string, S2 extends string>(string1: S1, string2: S2): HyphenJoin<S1, S2> {
    return `${string1}-${string2}`;
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

/* Flat token names are joined from nested specs, so two different paths can produce the same name - one
   token would then silently replace the other. Throws on the first name that appears twice. */
export function assertUnique(names: readonly string[], description: string): void {
    const seen = new Set<string>();
    for (const name of names) {
        if (seen.has(name)) throw new Error(`Duplicate ${description} "${name}".`);
        seen.add(name);
    }
}

/* Each key points at the keys it references. A key missing from the record ends a chain, so references to another
   level can be passed through as they are. Throws if a chain comes back around - CSS would silently resolve every
   custom property on it to the guaranteed-invalid value. */
export function assertNoCycles(next: { [key: string]: readonly string[] }, description: string): void {
    const settled = new Set<string>();
    const path: string[] = [];
    const visit = (key: string): void => {
        if (settled.has(key) || !Object.hasOwn(next, key)) return;
        const repeat = path.indexOf(key);
        if (repeat !== -1) throw new Error(`Cyclic ${description}: ${[...path.slice(repeat), key].join(" -> ")}.`);
        path.push(key);
        for (const nextKey of next[key]) visit(nextKey);
        path.pop();
        settled.add(key);
    };
    for (const key of Object.keys(next)) visit(key);
}

// A mapped token without a single ref would be declared nowhere.
export function assertMapped(mapping: { [token: string]: readonly unknown[] }, description: string): void {
    for (const [token, refs] of Object.entries(mapping))
        if (refs.length === 0) throw new Error(`No refs for ${description} "${token}".`);
}

/* Flattening nested content goes through `as` casts, so a missing or stray key can slip past the types. Flattening
   walks the schema's lookups, so a gap in the content shows up as a key holding `undefined` rather than a missing
   key. Throws unless the record has exactly the expected keys, each holding a value. */
export function assertComplete(expected: readonly string[], record: object, description: string): void {
    for (const key of expected)
        if ((record as { [key: string]: unknown })[key] === undefined) throw new Error(`Missing ${description} "${key}".`);
    const expectedKeys = new Set(expected);
    for (const key of Object.keys(record))
        if (!expectedKeys.has(key)) throw new Error(`Unexpected ${description} "${key}".`);
}
