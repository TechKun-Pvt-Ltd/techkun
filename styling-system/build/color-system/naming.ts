import type {AliasToken} from "./schema/lookups.ts";
import {buildCssCustomProperties, type CSSCustomProperties} from "./schema/shapes.ts";
import type {CSSValue} from "../shared/types.ts";
import {toVarRef} from "../shared/utils.ts";

/* Naming only: the CSS custom property each token, of any level, is declared as, how it's referenced, and the
   utility selector each semantic/component token gets. */

const PREFIX = "color";

export const cssCustomProperties: CSSCustomProperties = buildCssCustomProperties(token => `--${PREFIX}-${token}`);

export function tokenVar(token: keyof CSSCustomProperties): CSSValue {
    return toVarRef(cssCustomProperties[token]);
}

export function seedProperty<S extends string>(seed: S) {
    return `--${PREFIX}-${seed}` as const;
}

export function utilitySelector(token: AliasToken) {
    return `.${PREFIX}-${token}` as const;
}
