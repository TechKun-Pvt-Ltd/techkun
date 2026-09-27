import {componentTokensList, semanticTokensList} from "../schema/lookups.ts";
import {spec} from "../schema/spec.ts";
import type {AliasToken} from "../schema/lookups.ts";
import {aliasVars, componentUtilitySelector, primitiveUtilitySelectors, primitiveVars, semanticUtilitySelector} from "../naming.ts";
import {createObjectFromEntries, mergeAll} from "../../shared/utils.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import type {CSSRules} from "../../shared/types.ts";

/* Rules: one utility per token that has a selector, setting the token's own custom properties. */

const primitiveCssRules: CSSRules = ObjectStream.of(primitiveUtilitySelectors)
    .flatMap((proxyProperty, selector) => createObjectFromEntries(
        spec.primitive[proxyProperty].variants.map(variant => [selector(variant), primitiveVars(proxyProperty, variant)] as const)
    ))
    .collect();

function aliasTokenCssRules<T extends AliasToken>(tokens: T[], selector: (token: T) => string): CSSRules {
    return createObjectFromEntries(tokens.map(token => [selector(token), aliasVars(token)]));
}
const semanticCssRules: CSSRules = aliasTokenCssRules(semanticTokensList, semanticUtilitySelector);
const componentCssRules: CSSRules = aliasTokenCssRules(componentTokensList, componentUtilitySelector);

export const rules = mergeAll([primitiveCssRules, semanticCssRules, componentCssRules]);
