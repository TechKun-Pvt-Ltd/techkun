import {deviceBreakpoint} from "../device-breakpoints.ts";
import {toKebabCase} from "../../lib/kebab-case.ts";

const breakpointProperties = Object.entries(deviceBreakpoint)
    .map(([device, value]) => `--${toKebabCase(device)}: ${value}rem`);

// language=CSS
export default `
@layer tokens {
    :root {
        ${breakpointProperties.join(";\n        ")};
    }
}
`;