// This module is the parser.
import { declarations, rules } from "../type-system/index.ts";

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
                .map(([property, value]) => `${property}: ${value};`).join("\n\t\t")
            };\n\t}`
        ).join("\n\t")}
}
`.trim();