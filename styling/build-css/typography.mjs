// This module is the parser: it decides which layer each group lands in, then prints.
import {typeEmitter} from "../typography/index.ts";
import {layer, printCSS} from "../../styling-system/shared/css.ts";

export default printCSS([
    ...typeEmitter.registrations(),
    layer("base", typeEmitter.declarations()),
    layer("utilities", typeEmitter.utilities())
]);
