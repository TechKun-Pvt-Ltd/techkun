export type CSSToken = `--${string}`;
export type CSSValue = string | number;
export type CSSDeclarations = Record<CSSToken, CSSValue>;
