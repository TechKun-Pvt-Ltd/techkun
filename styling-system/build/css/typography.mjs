// This module is the parser: it decides which layer each group lands in, then prints.
import {typeEmitter} from "../type-system/index.ts";
import {layer, printCSS} from "../shared/css.ts";

export default printCSS([
    ...typeEmitter.registrations(),
    layer("base", typeEmitter.declarations()),
    layer("utilities", typeEmitter.utilities())
]);
