import {componentTokensList, semanticTokensList, tokenTargets} from "../schema/lookups.ts";
import type {ComponentToken, SemanticToken} from "../schema/lookups.ts";
import type {Target} from "../schema/spec.ts";
import {tokenVar, utilitySelector} from "../naming.ts";
import type {CSSRules} from "../../shared/types.ts";
import {createObjectFromEntries, mergeAll} from "../../shared/utils.ts";

/* Rules: one utility per semantic/component token, setting its target property to the token's own custom
   property. Tokens without a target property (brand) are skipped. Theme-independent, since a token's custom
   property has the same name in every theme. */

// Target -> the CSS property it colors.
const targetProperties = {
    bg: "background-color",
    text: "color",
    border: "border-color",
    fill: "fill",
    stroke: "stroke"
} as const satisfies { [T in Target]: string };

function cssRulesOf(tokens: (SemanticToken | ComponentToken)[]): CSSRules {
    return createObjectFromEntries(tokens.flatMap(token => {
        const target = tokenTargets[token];
        return target === undefined ? [] : [[utilitySelector(token), {[targetProperties[target]]: tokenVar(token)}] as const];
    }));
}

const semanticCssRules: CSSRules = cssRulesOf(semanticTokensList);
const componentCssRules: CSSRules = cssRulesOf(componentTokensList);

export const rules = mergeAll([semanticCssRules, componentCssRules]);
