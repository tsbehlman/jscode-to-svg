// LICENSE : MIT
"use strict";
import { lowlight } from "lowlight/lib/core.js";
const { registerLanguage, highlight } = lowlight;
import typescript from "highlight.js/lib/languages/typescript";
import astToSVG from "./ast-to-svg.js";
import splitMultilineTokensPlugin from "./plugins/splitMultilineTokens.js";
import tokensPlugin from "./plugins/tokens.js";

registerLanguage("typescript", typescript);

const defaultPlugins = [
    splitMultilineTokensPlugin,
    tokensPlugin
];

const defaultTheme = {
    keyword: "#0000FF",
    number: "#0000CD",
    boolean: "#C5060B",
    built_in: "#585CF6",
    string: "#036A07",
    regexp: "#036A07",
    comment: "#0066FF",
    subst: "#26B31A",
};

const defaultFormattingOptions = {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 12,
    charWidth: 6,
    width: "auto",
    height: "auto",
    plugins: defaultPlugins,
    theme: defaultTheme
};

function mergeWithDefaultFormattingOptions(formattingOptions = defaultFormattingOptions) {
    return {
        ...defaultFormattingOptions,
        charWidth: (formattingOptions.fontSize || defaultFormattingOptions.fontSize) / 2,
        lineHeight: formattingOptions.fontSize || defaultFormattingOptions.fontSize,
        ...formattingOptions,
    };
}

const BUILTIN_LITERALS = new Set([ "null", "undefined", "NaN", "Infinity" ]);
const BOOLEAN_LITERALS = new Set([ "true", "false" ]);

function sanitizeClassName(className) {
    return className.replaceAll(/_$/g, "");
}

function sanitizeToken({ type, value }) {
    if (type.endsWith("literal") || type.endsWith("title class")) {
        if (BUILTIN_LITERALS.has(value)) {
            return {
                type: type.replace(/(literal|title class)$/, "literal built_in"),
                value,
            };
        } else if (BOOLEAN_LITERALS.has(value)) {
            return {
                type: type.replace(/(literal|title class)$/, "literal boolean"),
                value,
            };
        }
    }
    
    return { type, value };
}

function tokensFromNode(node) {
    const tokens = [];
    const parentTypes = [];
    const nodesToVisit = [ ...node.children ];
    
    while (nodesToVisit.length > 0) {
        const node = nodesToVisit.shift();
        if (node === null) {
            parentTypes.pop();
        } else {
            if (node.value && node.value.length > 0) {
                tokens.push(sanitizeToken({
                    type: parentTypes.join(" "),
                    value: node.value,
                }));
            }
            if (node.children) {
                parentTypes.push(node.properties.className.map(sanitizeClassName).join(" "));
                nodesToVisit.unshift(null);
                nodesToVisit.unshift( ...node.children );
            }
        }
    }
    
    return tokens;
}

export function toSVG(code, formattingOptions) {
    
    const rootNode = highlight("typescript", code, { prefix: "" });
    const ast = {
        tokens: tokensFromNode(rootNode),
    };
    
    formattingOptions = mergeWithDefaultFormattingOptions(formattingOptions);
    
    return astToSVG(ast, formattingOptions);
}