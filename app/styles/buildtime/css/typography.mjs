// This module is the parser.
import {declarations, rules} from "../type-system-utils/registry.ts";
import {CSS_PROPERTY_NAME} from "../type-system-utils/shared.ts";

// language=CSS
export default `
@layer base {
    :root {
        ${Object.entries(declarations).map(([name, value]) => `${name}: ${value};`).join("\n\t\t")}
    }
}
@layer utilities {
    ${Object.entries(rules)
        .map(([selector, rules]) =>
            `${selector} {\n\t\t${Object
                .entries(rules)
                .map(([property, value]) => `${CSS_PROPERTY_NAME[property]}: ${value};`).join("\n\t\t")
            };\n}`
        ).join("\n\t")}
}
`.trim();