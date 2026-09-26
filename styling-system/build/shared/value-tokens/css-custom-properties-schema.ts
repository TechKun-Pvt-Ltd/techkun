import type {GetPrimitiveToken, GetSemanticToken, SchemaShape} from "./schema-shape.ts";
import type {CSSCustomProperty} from "../types.ts";
import {createObjectFromEntries} from "../utils.ts";

/* Every token, of any level, is declared as one custom property. Component tokens are typed by C, since how
   they're named is up to the implementation. */
export type GetCustomProperties<S extends SchemaShape, C extends string> = {
    [T in GetPrimitiveToken<S> | GetSemanticToken<S> | C]: CSSCustomProperty;
};

export function getCustomPropertiesBuilder<S extends SchemaShape, C extends string>(
    primitiveTokens: GetPrimitiveToken<S>[],
    semanticTokens: GetSemanticToken<S>[],
    componentTokens: C[]
) {
    return (
        naming: (token: GetPrimitiveToken<S> | GetSemanticToken<S> | C) => CSSCustomProperty
    ): GetCustomProperties<S, C> => createObjectFromEntries(
        [...primitiveTokens, ...semanticTokens, ...componentTokens].map(token => [token, naming(token)] as const)
    );
}
