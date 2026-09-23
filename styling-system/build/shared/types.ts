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
// The descriptor block of an `@property` at-rule, for custom properties that need to be registered.
export type CSSPropertyRegistration = {
    syntax: string;
    inherits: boolean;
    initialValue: CSSValue;
};
