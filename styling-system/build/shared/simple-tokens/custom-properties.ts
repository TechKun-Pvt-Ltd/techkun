import type {CSSCustomProperty, CSSValue} from "../types.ts";
import type {GetTokenRef} from "../schema-shape-base.ts";
import {assertUnique, createObjectFromEntries, toVarRef} from "../utils.ts";
import type {GetToken, SimpleSchema, SimpleSchemaShape} from "./schema.ts";

/* Entity 2 (simple): the CSS custom property every token and standalone is declared as. */

export type GetCSSCustomProperties<S extends SimpleSchemaShape> = {
    [T in GetToken<S>]: CSSCustomProperty;
};

// The custom-property half of a system's naming.
export interface SimpleCustomPropertyNaming<S extends SimpleSchemaShape, N extends string> {
    standalone(name: N): CSSCustomProperty;
    token(token: GetToken<S>): CSSCustomProperty;
}

export type GetTokenRefResolver<S extends SimpleSchemaShape> = (ref: GetTokenRef<S, GetToken<S>>) => CSSCustomProperty;

export class SimpleCustomProperties<S extends SimpleSchemaShape, N extends string = never> {
    readonly schema: SimpleSchema<S>;
    readonly #standalones: { [K in N]: CSSCustomProperty };
    readonly #tokens: GetCSSCustomProperties<S>;

    constructor(schema: SimpleSchema<S>, standalones: readonly N[], naming: SimpleCustomPropertyNaming<S, N>) {
        this.schema = schema;
        this.#standalones = createObjectFromEntries(standalones.map(name => [name, naming.standalone(name)] as const));
        this.#tokens = createObjectFromEntries(schema.tokens.map(token => [token, naming.token(token)] as const));
        // Distinct names can still be named alike; one declaration would then silently replace the other.
        assertUnique([...Object.values<CSSCustomProperty>(this.#standalones), ...Object.values<CSSCustomProperty>(this.#tokens)], "custom property");
    }

    standalone(name: N): CSSCustomProperty {
        return this.#standalones[name];
    }
    standaloneVar(name: N): CSSValue {
        return toVarRef(this.standalone(name));
    }
    of(token: GetToken<S>): CSSCustomProperty {
        return this.#tokens[token];
    }
    var(token: GetToken<S>): CSSValue {
        return toVarRef(this.of(token));
    }

    readonly resolve: GetTokenRefResolver<S> = ({ref}) => this.of(ref);
}
