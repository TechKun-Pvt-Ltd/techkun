import type {CSSPropertiesByProperty, Property} from "./config.ts";

export type CSSToken = `--${string}`;
export type CSSValue = string | number;
// type TokensByProperty = Record<string, string>;
export type CSSDeclarations = Record<CSSToken, CSSValue>;
export type CSSRules = {
    [selector: string]: {
        [P in CSSProperty]?: CSSValue;
    };
};

export interface TypeTokensLayer {
    getCSSDeclarations(): CSSDeclarations | null;
    getCSSRules(): CSSRules | null;
}

export const PROPERTIES = ["font-size", "line-height", "letter-spacing", "font-weight"] as const;
export type CSSProperty = typeof PROPERTIES[number];

/* Everything the token levels (primitives, semantic, context) have in common.
   Primitives are tied to a property, so their objects are keyed by property first: `object[property][token]`.
   Semantic and context tokens are tied to intent, so their objects are keyed by token first: `object[token][property]`. */

export function toVarRefs<P extends Property = Property>(
    cssPropertyValues: Record<CSSPropertiesByProperty<P>, CSSToken>
): {[K in CSSPropertiesByProperty<P>]: CSSValue} {
    return mapObjectValues(cssPropertyValues, name => `var(${name})`);
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