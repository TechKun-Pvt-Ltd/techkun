import {deviceBreakpoint} from "../device-breakpoints.ts";
import {toKebabCase} from "../shared/utils.ts";

const breakpointProperties = Object.entries(deviceBreakpoint)
    .map(([device, value]) => `--${toKebabCase(device)}: ${value}rem`);

// language=CSS
export default `
@layer base {
    :root {
        ${breakpointProperties.join(";\n        ")};
    }
}
`;