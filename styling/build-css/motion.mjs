import {easing} from "../motion.ts";
import {toKebabCase} from "../../lib/kebab-case.ts";

const easingProperties = Object.entries(easing)
    .map(([curve, points]) => `--ease-${toKebabCase(curve)}: cubic-bezier(${points.join(", ")})`);

// language=CSS
export default `
@layer tokens {
    :root {
        ${easingProperties.join(";\n        ")};
    }
}
`;
