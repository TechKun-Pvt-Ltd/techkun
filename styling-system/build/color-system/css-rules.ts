import {ComponentTokensList, SemanticTokensList, TargetProperties} from "./schema.ts";
import type {ComponentToken, SemanticToken} from "./schema.ts";
import {cssCustomProperties} from "./css-custom-properties.ts";
import type {CSSRules} from "../shared/types.ts";
import {createObjectFromEntries, toVarRef} from "../shared/utils.ts";

/* Rules: one utility per semantic/component token, setting its target property to the token's own custom
   property. Tokens without a target property (brand) are skipped. Theme-independent, since a token's custom
   property has the same name in every theme. */
const selectors = {
    semantic: token => `.color-${token}`,
    component: token => `.color-${token}`
} as const satisfies {
    semantic: (token: SemanticToken) => string;
    component: (token: ComponentToken) => string;
};

function cssRulesOf<T extends SemanticToken | ComponentToken>(tokens: T[], selector: (token: T) => string): CSSRules {
    return createObjectFromEntries(tokens.flatMap(token => {
        const targetProperty = TargetProperties[token];
        return targetProperty === undefined ? [] : [[selector(token), {[targetProperty]: toVarRef(cssCustomProperties[token])}] as const];
    }));
}

export const semanticCssRules: CSSRules = cssRulesOf(SemanticTokensList, selectors.semantic);
export const componentCssRules: CSSRules = cssRulesOf(ComponentTokensList, selectors.component);
