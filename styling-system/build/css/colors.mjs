// This module is the parser.
import {declarations, registrations, rules, themes} from "../color-system/index.ts";

/** @param {Record<string, string | number>} record @param {string} indent */
const printDeclarations = (record, indent) => Object.entries(record)
    .map(([name, value]) => `${name}: ${value};`)
    .join(`\n${indent}`);

// language=CSS
export default `
${Object.entries(registrations)
    .map(([name, {syntax, inherits, initialValue}]) =>
        `@property ${name} {\n\tsyntax: "${syntax}";\n\tinherits: ${inherits};\n\tinitial-value: ${initialValue};\n}`
    ).join("\n")}
@layer base {
    :root {
        ${printDeclarations(declarations, "\t\t")}
    }
    ${Object.values(themes)
        .map(({selector, colorScheme, declarations}) =>
            `${selector} {\n\t\tcolor-scheme: ${colorScheme};\n\t\t${printDeclarations(declarations, "\t\t")}\n\t}`
        ).join("\n\t")}
}
@layer utilities {
    ${Object.entries(rules)
        .map(([selector, rule]) => `${selector} { ${printDeclarations(rule, "")} }`)
        .join("\n\t")}
}
`.trim();
