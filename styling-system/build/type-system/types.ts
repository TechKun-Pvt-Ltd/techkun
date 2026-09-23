import type {SemanticToken} from "./mapping.ts";
import {Schema} from "./schema.ts";

type UnwrapUnionArray<A extends readonly any[]> = A extends readonly any[] ? A[number] : never;

export type CSSToken = `--${string}`;
export type CSSValue = string | number;
export type CSSTokenDeclarations = {
    [K in CSSToken]: CSSValue;
};

export type TokenFamily = keyof typeof Schema;
export type TokenOf<F extends TokenFamily> = UnwrapUnionArray<typeof Schema[F]["tokens"]>;
export type TypeSizeToken = TokenOf<"typeSize">;
export type WeightToken = TokenOf<"weight">;

export type CSSPropertyOf<F extends TokenFamily> = typeof Schema[F]["cssProperties"][number];
export type CSSProperty = UnwrapUnionArray<typeof Schema[TokenFamily]["cssProperties"]>;
export type CSSPropertyValues<F extends TokenFamily = TokenFamily> = {
    [CP in TokenFamily extends F ? CSSProperty : CSSPropertyOf<F>]: CSSValue;
};

export type CSSRules = {
    [selector: string]: {
        [P in CSSProperty]?: CSSValue;
    };
};

export type PrimitiveValues = {
    [F in TokenFamily]: {
        [T in TokenOf<F>]: CSSPropertyValues<F>;
    };
};
export type PrimitiveMapping = {
    [F in TokenFamily]: TokenOf<F>;
};
export type SemanticMapping = {
    semanticToken: SemanticToken;
    primitiveOverrides?: Partial<PrimitiveMapping>;
};