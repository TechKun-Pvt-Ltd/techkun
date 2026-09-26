import {buildCustomProperties, type CustomProperties} from "./schema.ts";

/* Naming only: the CSS custom property each token, of any level, is declared as. */

export const cssCustomProperties: CustomProperties = buildCustomProperties(token => `--color-${token}`);
