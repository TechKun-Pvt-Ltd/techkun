// This module is the parser: it decides which layer each group lands in, then prints.
import {colorEmitter} from "../colors/index.ts";
import {layer, printCSS} from "../../styling-system/shared/css.ts";

const utilities = colorEmitter.utilities();

export default printCSS([
    ...colorEmitter.registrations(),
    layer("tokens", colorEmitter.declarations()),
    layer("components", utilities.component),
    layer("utilities.semantic", utilities.semantic),
    layer("utilities.primitive", utilities.primitive)
]);
