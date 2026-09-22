import type {SemanticToken} from "./mapping.ts";
import type {CSSProperty, CSSPropertyValues, TokenFamily, TokenOf} from "./schema.ts";

export type CSSToken = `--${string}`;
export type CSSValue = string | number;
export type CSSTokenDeclarations = {
    [K in CSSToken]: CSSValue;
};
export type CSSRules = {
    [selector: string]: {
        [P in CSSProperty]?: CSSValue;
    };
};

export interface TypeTokensLayer {
    getCSSTokenDeclarations(): CSSTokenDeclarations | null;
    getCSSRules(): CSSRules | null;
}

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