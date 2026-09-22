// Token families: each one is a set of tokens (the names a mapping can pick from) plus the CSS properties every
// token of the family sets.
import type {CSSValue} from "./types.ts";

const Schema = {
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

type UnwrapUnionArray<A extends readonly any[]> = A extends readonly any[] ? A[number] : never;

export type TokenFamily = keyof typeof Schema;
export type TokenOf<F extends TokenFamily> = UnwrapUnionArray<typeof Schema[F]["tokens"]>;
export type TypeSizeToken = TokenOf<"typeSize">;
export type WeightToken = TokenOf<"weight">;

export type CSSPropertyOf<F extends TokenFamily> = typeof Schema[F]["cssProperties"][number];
export type CSSProperty = UnwrapUnionArray<typeof Schema[TokenFamily]["cssProperties"]>;
export type CSSPropertyValues<F extends TokenFamily = TokenFamily> = {
    [CP in TokenFamily extends F ? CSSProperty : CSSPropertyOf<F>]: CSSValue;
};