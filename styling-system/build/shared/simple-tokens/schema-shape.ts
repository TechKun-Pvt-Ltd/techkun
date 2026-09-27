import type {CSSCustomProperty, CSSValue, NoReservedRefKeys} from "../types.ts";
import {toVarRef} from "../utils.ts";

export type SchemaShape = {
    primitive: readonly string[];
    semantic: readonly string[];
    component?: readonly string[];
    modifiers?: {
        [modifier: string]: readonly string[]; // contexts
    };
};

export type GetPrimitiveToken<S extends SchemaShape> = S["primitive"][number];
export type GetSemanticToken<S extends SchemaShape> = S["semantic"][number];
export type GetComponentToken<S extends SchemaShape> = S["component"] extends readonly string[] ? S["component"][number] : never;

export type GetToken<S extends SchemaShape> = GetPrimitiveToken<S> | GetSemanticToken<S> | GetComponentToken<S>;

export type GetPrimitiveValues<S extends SchemaShape> = {
    [PT in GetPrimitiveToken<S>]: CSSValue;
};

export type GetCSSCustomProperties<S extends SchemaShape> = {
    [T in GetToken<S>]: CSSCustomProperty;
};

type GetModifier<S extends SchemaShape> = S["modifiers"] extends {} ? keyof S["modifiers"] : never;
type GetModifierContext<S extends SchemaShape, M extends GetModifier<S>> = S["modifiers"] extends {} ? S["modifiers"][M][number] : never;
export type GetModifiersRef<S extends SchemaShape> = {
    [M in GetModifier<S>]: GetModifierContext<S, M>;
};
type GetTokenRef<S extends SchemaShape, T extends GetToken<S>, A extends NoReservedRefKeys<A> = {}> = {
    ref: T;
    modifiers?: GetModifiersRef<S>;
} & A;

export type GetSemanticMappingTokenRef<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> = GetTokenRef<S, GetPrimitiveToken<S> | GetSemanticToken<S>, A>;
export type GetSemanticMapping<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [ST in GetSemanticToken<S>]: GetSemanticMappingTokenRef<S, A>;
};

export type GetComponentMappingTokenRef<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> = GetTokenRef<S, GetToken<S>, A>;
export type GetComponentMapping<S extends SchemaShape, A extends NoReservedRefKeys<A> = {}> = {
    [CT in GetComponentToken<S>]: GetComponentMappingTokenRef<S, A>;
};

export type GetTokenRefResolver<S extends SchemaShape> = (ref: GetTokenRef<S, GetToken<S>>["ref"]) => CSSValue;
export function getTokenRefResolver<S extends SchemaShape>(cssCustomProperties: GetCSSCustomProperties<S>): GetTokenRefResolver<S> {
    return ref => toVarRef(cssCustomProperties[ref]);
}