// This module is the parser: it decides which layer each group lands in, then prints.
import {colorEmitter} from "../colors/index.ts";
import {layer, printCSS} from "../../styling-system/shared/css.ts";

export default printCSS([
    ...colorEmitter.registrations(),
    layer("base", colorEmitter.declarations()),
    layer("utilities", colorEmitter.utilities())
]);
