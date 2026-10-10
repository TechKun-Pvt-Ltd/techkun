import type {SimpleCustomPropertyNaming} from "../../styling-system/shared/simple-tokens/custom-properties.ts";
import type {SimpleSelectorNaming} from "../../styling-system/shared/simple-tokens/emitter.ts";
import type {FlatSchema, Theme} from "./spec.ts";
import type {Seed} from "./custom-properties.ts";

/* Naming only, in one place: the custom property each seed and token is declared as, and the selectors they're
   used from. Entity 2 sees only the custom-property half, entity 4 only the selector half. */

const PREFIX = "color";

// Where each theme's semantic tokens are declared.
const themeSelectors = {
    dark: ":root"
} as const satisfies { [T in Theme]: string };

export const colorNaming = {
    standalone: seed => `--${PREFIX}-${seed}`,
    token: token => `--${PREFIX}-${token}`,
    utilitySelector: token => `.${PREFIX}-${token}`,
    themeSelector: theme => themeSelectors[theme]
} satisfies SimpleCustomPropertyNaming<FlatSchema, Seed> & SimpleSelectorNaming<FlatSchema> & { themeSelector(theme: Theme): string };
