import type {StandaloneValues} from "../../shared/standalones.ts";
import {typeProperties, type Standalone} from "../custom-properties.ts";

/* Scale ratio — choose a musical interval:
   Minor Second:   1.067  (1 semitone)
   Major Second:   1.125  (2 semitones)
   Minor Third:    1.189  (3 semitones)
   Major Third:    1.260  (4 semitones) ← a good default for UI
   Perfect Fourth: 1.333  (5 semitones)
   Tritone:        1.414  (6 semitones)
   Perfect Fifth:  1.500  (7 semitones)
*/
export const MIN_SCALE_RATIO = 1.125;
export const MAX_SCALE_RATIO = 1.260;
export const LS_OFFSET = 0.01;

export function standaloneVar(standalone: Standalone) {
    return typeProperties.standaloneVar(standalone);
}

export const standalones = {
    // language=CSS prefix="div { --var: " suffix="; }"
    "scale-ratio": {value: `calc(${MIN_SCALE_RATIO} + ${MAX_SCALE_RATIO - MIN_SCALE_RATIO} * var(--mobile-s-to-laptop-mid))`},
    "ls-offset": {value: `${LS_OFFSET}em`}
} satisfies StandaloneValues<Standalone>;
