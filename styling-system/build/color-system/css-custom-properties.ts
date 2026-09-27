import {buildCssCustomProperties, type CSSCustomProperties} from "./schema.ts";

/* Naming only: the CSS custom property each token, of any level, is declared as. */

export const cssCustomProperties: CSSCustomProperties = buildCssCustomProperties(token => `--color-${token}`);
