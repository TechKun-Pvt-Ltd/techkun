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
