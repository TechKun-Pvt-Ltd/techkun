export type CSSCustomProperty = `--${string}`;
export type CSSValue = string | number;
// The descriptor block of an `@property` at-rule, for custom properties that need to be registered.
export type CSSPropertyRegistration = {
    syntax: string;
    inherits: boolean;
    initialValue: CSSValue;
};

type ReservedRefKey = "ref" | "modifiers";
export type NoReservedRefKeys<A> = [Extract<keyof A, ReservedRefKey>] extends [never] ? object : never;