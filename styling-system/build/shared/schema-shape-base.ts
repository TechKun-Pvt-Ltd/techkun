import type {NoReservedRefKeys} from "./types.ts";

/* What every schema shape has in common, whatever its primitive tokens look like: the alias levels and the
   modifiers. Simple and composite schema shapes extend it with their own `primitive`. */

export interface SchemaShapeBase {
    semantic: readonly string[];
    component?: readonly string[];
    modifiers?: {
        [modifier: string]: readonly string[]; // contexts
    };
}

export type GetSemanticToken<S extends SchemaShapeBase> = S["semantic"][number];
export type GetComponentToken<S extends SchemaShapeBase> = S["component"] extends readonly string[] ? S["component"][number] : never;
export type GetAliasToken<S extends SchemaShapeBase> = GetSemanticToken<S> | GetComponentToken<S>;

type GetModifier<S extends SchemaShapeBase> = S["modifiers"] extends {} ? keyof S["modifiers"] : never;
type GetModifierContext<S extends SchemaShapeBase, M extends GetModifier<S>> = S["modifiers"] extends {} ? S["modifiers"][M][number] : never;
export type GetModifiersRef<S extends SchemaShapeBase> = {
    [M in GetModifier<S>]: GetModifierContext<S, M>;
};
export type GetTokenRef<S extends SchemaShapeBase, T, A extends NoReservedRefKeys<A> = {}> = {
    ref: T;
    modifiers?: GetModifiersRef<S>;
} & A;


/* The token lists every schema has, whatever its primitives look like. */
export abstract class Schema<S extends SchemaShapeBase> {
    readonly shape: S;

    protected constructor(shape: S) {
        this.shape = shape;
    }

    get semanticTokens(): GetSemanticToken<S>[] {
        return [...this.shape.semantic];
    }
    get componentTokens(): GetComponentToken<S>[] {
        // TS can't narrow an optional level of a generic shape, hence the cast.
        return [...(this.shape.component ?? [])] as GetComponentToken<S>[];
    }
    get aliasTokens(): GetAliasToken<S>[] {
        return [...this.semanticTokens, ...this.componentTokens];
    }
    // Every combination of one context per modifier - `[{theme: "dark"}]`. Empty for a schema without modifiers.
    get modifierContexts(): GetModifiersRef<S>[] {
        const modifiers = Object.entries(this.shape.modifiers ?? {});
        if (modifiers.length === 0) return [];
        return modifiers.reduce<{ [modifier: string]: string }[]>(
            (combinations, [modifier, contexts]) => combinations.flatMap(combination =>
                contexts.map(context => ({...combination, [modifier]: context}))),
            [{}]
        ) as GetModifiersRef<S>[];
    }
}
