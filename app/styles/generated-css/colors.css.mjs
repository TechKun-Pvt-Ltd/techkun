import {processConfig} from "./css-palette-generation-utils.ts";
import {PALETTE_CUSTOMIZATION} from "./css-palette-customization.ts";
import {PRIMARY_HUE, PRIMARY_LIGHTNESS, PRIMARY_CHROMA} from "../theme/color-constants.ts";

const rules = processConfig(PALETTE_CUSTOMIZATION);

// language=CSS
export default `@layer base {
    :root {
        --primary-hue: ${PRIMARY_HUE};
        --lightness: ${PRIMARY_LIGHTNESS};
        --chroma: ${PRIMARY_CHROMA};
        ${Object.entries(rules)
            .map(entry => entry.join(": "))
            .join(";\n")};
    }
}`;