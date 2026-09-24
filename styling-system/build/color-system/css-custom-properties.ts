import {ComponentTokensList, PrimitiveTokensList, SemanticTokensList} from "./schema.ts";
import type {Token} from "./schema.ts";
import {createObjectFromEntries} from "../shared/utils.ts";
import type {CSSToken} from "../shared/types.ts";

/* Naming only: the CSS custom property each token, of any level, is declared as. */

export const cssCustomProperties: { [T in Token]: CSSToken } = createObjectFromEntries(
    [...PrimitiveTokensList, ...SemanticTokensList, ...ComponentTokensList].map(token => [token, `--color-${token}`] as const)
);
