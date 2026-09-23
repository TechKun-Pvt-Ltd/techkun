export type CSSToken = `--${string}`;
export type CSSValue = string | number;
export type CSSTokenDeclarations = {
    [K in CSSToken]: CSSValue;
};
export type CSSRules = {
    [selector: string]: {
        [cssProperty: string]: CSSValue;
    };
};