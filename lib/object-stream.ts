/* A type-safe, fluent wrapper around a plain object for transforming its keys, values, and entries -
   `map`/`filter`/`collect`, in the spirit of a Java-style Stream. Unlike `Object.entries`/`keys`/`values`,
   which widen keys to `string` and values to a flattened union, every callback here keeps the exact
   key and value types of the object it was built from.

   The trade-off is on the way out, not the way in: a callback can compute a new key or value from
   any key/value/entry, so TypeScript can no longer correlate which new key came from which old one.
   `mapKeys`/`mapEntries`/the `map*To*` methods therefore return a *sound but conservative* type - "any
   of these new keys, holding any of these possible values" - rather than a precise per-key mapping.
   `mapValues` (and `mapKeyToValue`/`mapEntryToValue`) are the exception: since keys never change, their
   result type stays exact. */

// export type Key<T extends object> = keyof T;
export type Key<T extends object> = T extends object ? keyof T : never;
// export type Value<T extends object> = T[Key<T>];
export type Value<T extends object> = T extends object ? T[keyof T] : never;
// export type Key<T extends object> = keyof T extends never ? T extends object ? keyof T : never : keyof T;
// export type Value<T extends object> = T[keyof T] extends never ? T extends object ? T[keyof T] : never : T[keyof T];

// type Entry<T extends object> = { [K in keyof T]: [K, T[K]] }[keyof T];
type Entry<T extends object> = { [K in keyof T]: [T extends object ? K : never, T extends object ? T[K] : never] }[keyof T];
// function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
//     return typeof value === "object" && value !== null && !Array.isArray(value);
// }

export class ObjectStream<T extends object> {
    private readonly entries: Entry<T>[];

    private constructor(entries: Entry<T>[]) {
        this.entries = entries;
    }

    static of<T extends object>(source: T): ObjectStream<T> {
        return new ObjectStream(Object.entries(source) as Entry<T>[]);
    }

    /* --- Primitives: every other map* method below is a one-line composition of these three. --- */

    mapEntries<NK extends PropertyKey, NV>(
        mapper: (key: Key<T>, value: Value<T>) => [NK, NV]
    ): ObjectStream<{ [P in NK]: NV }> {
        return new ObjectStream(this.entries.map(([key, value]) => mapper(key, value)) as any);
    }

    mapEntryToKey<NK extends PropertyKey>(
        mapper: (key: Key<T>, value: Value<T>) => NK
    ): ObjectStream<{ [P in NK]: Value<T> }> {
        return this.mapEntries((key, value) => [mapper(key, value), value]);
    }

    mapEntryToValue<NV>(mapper: (key: Key<T>, value: Value<T>) => NV): ObjectStream<{ [K in Key<T>]: NV }> {
        return this.mapEntries((key, value) => [key, mapper(key, value)]);
    }

    /* --- Everything else, derived. --- */

    mapKeys<NK extends PropertyKey>(mapper: (key: Key<T>) => NK): ObjectStream<{ [P in NK]: Value<T> }> {
        return this.mapEntryToKey(key => mapper(key));
    }

    mapValues<NV>(mapper: (value: Value<T>) => NV): ObjectStream<{ [K in Key<T>]: NV }> {
        return this.mapEntryToValue((_key, value) => mapper(value));
    }

    mapKeyToValue<NV>(mapper: (key: Key<T>) => NV): ObjectStream<{ [K in Key<T>]: NV }> {
        return this.mapEntryToValue(key => mapper(key));
    }

    mapKeyToEntry<NK extends PropertyKey, NV>(
        mapper: (key: Key<T>) => [NK, NV]
    ): ObjectStream<{ [P in NK]: NV }> {
        return this.mapEntries(key => mapper(key));
    }

    mapValueToKey<NK extends PropertyKey>(mapper: (value: Value<T>) => NK): ObjectStream<{ [P in NK]: Value<T> }> {
        return this.mapEntryToKey((_key, value) => mapper(value));
    }

    mapValueToEntry<NK extends PropertyKey, NV>(
        mapper: (value: Value<T>) => [NK, NV]
    ): ObjectStream<{ [P in NK]: NV }> {
        return this.mapEntries((_key, value) => mapper(value));
    }

    flatMap<R extends object>(
        mapper: (key: Key<T>, value: Value<T>) => R | ObjectStream<R>
    ): ObjectStream<R extends object ? { [K in keyof R]: R[K]; } : never> {
        const result: [PropertyKey, unknown][] = [];
        for (const [key, value] of this.entries) {
            const mapped = mapper(key, value);
            // if (isPlainObject(mapped)) {
            result.push(...(mapped instanceof ObjectStream ? mapped.entries : Object.entries(mapped)));
            // } else {
            //     result.push([key, mapped]);
            // }
        }
        return new ObjectStream(result as any);
    }

    filter(predicate: (key: Key<T>, value: Value<T>) => boolean): ObjectStream<Partial<T>> {
        return new ObjectStream(this.entries.filter(([key, value]) => predicate(key, value)) as any);
    }

    sort(comparator: (a: Entry<T>, b: Entry<T>) => number): ObjectStream<T> {
        return new ObjectStream([...this.entries].sort(comparator));
    }

    collect(): T {
        return Object.fromEntries(this.entries) as T;
    }
}
