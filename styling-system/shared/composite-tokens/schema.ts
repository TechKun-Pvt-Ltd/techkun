import type {NoReservedRefKeys} from "../types.ts";
import {
    Schema, type GetAliasToken, type GetSemanticToken, type GetTokenRef, type SchemaShapeBase
} from "../schema-shape-base.ts";
import {assertUnique} from "../utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

/* Entity 1 (composite): the validated flat schema. A primitive token is a variant of a proxy property - a group
   of CSS properties set together - and alias tokens set every proxy property. */

export interface CompositeSchemaShape extends SchemaShapeBase {
    primitive: {
        [proxyProperty: string]: {
            variants: readonly string[];
            properties: readonly string[];
        }
    };
}
export type GetProxyProperty<S extends CompositeSchemaShape> = keyof S["primitive"];
export type GetVariantOf<S extends CompositeSchemaShape, P extends GetProxyProperty<S>> = ElementOf<S["primitive"][P]["variants"]>;
export type GetCSSPropertyOf<S extends CompositeSchemaShape, P extends GetProxyProperty<S>> = ElementOf<S["primitive"][P]["properties"]>;

export type GetPrimitiveToken<S extends CompositeSchemaShape> = {
    [P in GetProxyProperty<S>]: GetVariantOf<S, P>;
};

export type GetPropertyProxyMap<S extends CompositeSchemaShape> = { [P in GetProxyProperty<S>]: GetCSSPropertyOf<S, P>[]; };

export type GetPrimitiveTokenRef<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> =
    GetTokenRef<S, GetPrimitiveToken<S>, A & { kind: "primitive" }>;
export type GetAliasTokenRef<S extends CompositeSchemaShape, T extends GetAliasToken<S> = GetAliasToken<S>, A extends NoReservedRefKeys<A> = {}> =
    GetTokenRef<S, T, A & { kind: "alias", override?: Partial<GetPrimitiveToken<S>>; }>;

export type GetSemanticMappingTokenRef<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> =
    | GetPrimitiveTokenRef<S>
    | GetAliasTokenRef<S, GetSemanticToken<S>, A>;
export type GetComponentMappingTokenRef<S extends CompositeSchemaShape, A extends NoReservedRefKeys<A> = {}> =
    | GetPrimitiveTokenRef<S>
    | GetAliasTokenRef<S, GetAliasToken<S>, A>;

type ElementOf<A extends readonly any[]> = A extends readonly any[] ? A[number] : never;

export class CompositeSchema<S extends CompositeSchemaShape> extends Schema<S> {
    // Proxy property -> the CSS properties it stands in for.
    readonly propertyProxyMap: GetPropertyProxyMap<S>;

    constructor(shape: S, description: string) {
        super(shape);
        this.propertyProxyMap = ObjectStream.of(shape.primitive)
            .mapValues(({properties}) => [...properties])
            .collect() as GetPropertyProxyMap<S>;
        // A primitive token is a variant of its proxy property, so its name only has to be unique within that property.
        for (const proxyProperty of this.proxyProperties)
            assertUnique(this.variantsOf(proxyProperty), `${description} ${String(proxyProperty)} token`);
        assertUnique(this.aliasTokens, `${description} alias token`);
        // Alias tokens set every CSS property through one bundle, so two proxy properties can't share one.
        assertUnique(this.cssProperties, `${description} CSS property`);
    }

    get proxyProperties(): GetProxyProperty<S>[] {
        return Object.keys(this.shape.primitive) as GetProxyProperty<S>[];
    }
    variantsOf<P extends GetProxyProperty<S>>(proxyProperty: P): GetVariantOf<S, P>[] {
        return [...this.shape.primitive[proxyProperty as string].variants] as GetVariantOf<S, P>[];
    }
    get cssProperties(): GetCSSPropertyOf<S, GetProxyProperty<S>>[] {
        return Object.values<GetCSSPropertyOf<S, GetProxyProperty<S>>[]>(this.propertyProxyMap).flat();
    }
}
