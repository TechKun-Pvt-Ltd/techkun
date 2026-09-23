// Token families: each one is a set of tokens (the names a mapping can pick from) plus the CSS properties every
// token of the family sets.
import type {CSSProperty} from "./types.ts";

export const Schema = {
    typeSize: {
        tokens: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
        cssProperties: ["font-size", "line-height", "letter-spacing"]
    },
    weight: {
        tokens: ["regular", "medium", "semibold", "bold"],
        cssProperties: ["font-weight"]
    }
} as const satisfies {
    [key: string]: {
        tokens: readonly string[];
        cssProperties: readonly string[];
    }
};
export const CSSProperties: CSSProperty[] = Object.values(Schema)
    .flatMap(family => family.cssProperties);