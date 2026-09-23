import {Categories} from "./schema.ts";
import {ComponentTokens, SemanticTokens, TokenCategories} from "./mapping.ts";
import type {ComponentToken, SemanticToken} from "./mapping.ts";
import {lookupComponentCssToken, lookupSemanticCssToken} from "./css-tokens-lookup.ts";
import type {CSSRules, CSSToken} from "../shared/types.ts";
import {createObjectFromEntries, toVarRef} from "../shared/utils.ts";

/* Rules: one utility per semantic/component token, setting its category's CSS property to the token's own
   custom property. Tokens whose category has no CSS property (brand) get no utility. Theme-independent,
   since a token's custom property has the same name in every theme. */

function buildCssRules<T extends SemanticToken | ComponentToken>(tokens: T[], lookupCssToken: (token: T) => CSSToken): CSSRules {
    return createObjectFromEntries(tokens.flatMap(token => {
        const cssProperty = Categories[TokenCategories[token]];
        return cssProperty === null ? [] : [[`.${token}`, {[cssProperty]: toVarRef(lookupCssToken(token))}] as const];
    }));
}

export const semanticCssRules: CSSRules = buildCssRules(SemanticTokens, lookupSemanticCssToken);
export const componentCssRules: CSSRules = buildCssRules(ComponentTokens, lookupComponentCssToken);
