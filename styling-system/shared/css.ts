import type {CSSPropertyRegistration, CSSValue} from "./types.ts";

/* The only things an emitter hands back: rules and at-rules. Declarations never travel on their own - they're
   always the body of a rule, or of an at-rule with a declaration block (`@property`, `@font-face`). */

export type CSSDeclarations = { readonly [property: string]: CSSValue };

export type CSSRule = {
    readonly type: "rule";
    readonly selector: string;
    readonly declarations: CSSDeclarations;
};

export type CSSAtRule = {
    readonly type: "at-rule";
    readonly name: string;
    readonly prelude: string;
} & ({ readonly declarations: CSSDeclarations } | { readonly rules: readonly CSSNode[] });

export type CSSNode = CSSRule | CSSAtRule;

export function rule(selector: string, declarations: CSSDeclarations): CSSRule {
    return {type: "rule", selector, declarations};
}

export function layer(name: string, rules: readonly CSSNode[]): CSSAtRule {
    return {type: "at-rule", name: "layer", prelude: name, rules};
}

export function propertyRegistration(name: string, {syntax, inherits, initialValue}: CSSPropertyRegistration): CSSAtRule {
    return {
        type: "at-rule", name: "property", prelude: name,
        declarations: {syntax: JSON.stringify(syntax), inherits: String(inherits), "initial-value": initialValue}
    };
}

// ========== Printing ==========

function printDeclarations(declarations: CSSDeclarations, indent: string): string {
    return Object.entries(declarations).map(([property, value]) => `${indent}${property}: ${value};`).join("\n");
}

function printNode(node: CSSNode, indent: string): string {
    const head = node.type === "rule" ? node.selector : `@${node.name} ${node.prelude}`;
    const body = "rules" in node
        ? node.rules.map(child => printNode(child, indent + "\t")).join("\n")
        : printDeclarations(node.declarations, indent + "\t");
    return `${indent}${head} {\n${body}\n${indent}}`;
}

export function printCSS(nodes: readonly CSSNode[]): string {
    return nodes.map(node => printNode(node, "")).join("\n");
}
