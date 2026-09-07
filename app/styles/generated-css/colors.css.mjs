import {processConfig} from "./css-palette-generation-utils.ts";
import {PALETTE_CUSTOMIZATION} from "./css-palette-customization.ts";

const rules = processConfig(PALETTE_CUSTOMIZATION);

// language=CSS
export default `@layer base {
    :root {
        ${Object.entries(rules)
            .map(entry => entry.join(": "))
            .join(";\n")};
    }
}`;