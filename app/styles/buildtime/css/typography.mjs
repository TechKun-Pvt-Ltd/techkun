import {PRIMITIVE_PROPERTIES, PRIMITIVE_RULES} from "../type-system-utils/primitives.ts";
import {SEMANTIC_PROPERTIES, SEMANTIC_RULES} from "../type-system-utils/semantic.ts";
import {CONTEXT_RULES} from "../type-system-utils/context.ts";

const ROOT_PROPERTIES = Object
    .entries({...PRIMITIVE_PROPERTIES, ...SEMANTIC_PROPERTIES})
    .map(([name, value]) => `${name}: ${value};`);
const RULES = [...PRIMITIVE_RULES, ...SEMANTIC_RULES, ...CONTEXT_RULES];

// language=CSS
export default `
@layer base {
    :root {
        ${ROOT_PROPERTIES.join("\n        ")}
    }
}
@layer utilities {
    ${RULES.join("\n").replaceAll("\n", "\n    ")}
}
`.trim();
