// This module is the parser: it decides which layer each group lands in, then prints.
import {typeEmitter} from "../typography/index.ts";
import {layer, printCSS} from "../../styling-system/shared/css.ts";

const utilities = typeEmitter.utilities();

export default printCSS([
    ...typeEmitter.registrations(),
    layer("tokens", typeEmitter.declarations()),
    layer("components", utilities.component),
    layer("utilities.semantic", utilities.semantic),
    layer("utilities.primitive", utilities.primitive)
]);
