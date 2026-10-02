import {motionEasing} from "../motion.ts";
import {toKebabCase} from "../shared/utils.ts";

const easingProperties = Object.entries(motionEasing)
    .map(([curve, points]) => `--ease-${toKebabCase(curve)}: cubic-bezier(${points.join(", ")})`);

// language=CSS
export default `
@layer base {
    :root {
        ${easingProperties.join(";\n        ")};
    }
}
`;
