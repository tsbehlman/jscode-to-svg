// LICENSE : MIT
"use strict";
import espree from "espree";
import astToSVG from "./ast-to-svg.js";
import commentsPlugin  from "./plugins/comments.js";
import tokensPlugin  from "./plugins/tokens.js";

const defaultPlugins = [
    tokensPlugin,
    commentsPlugin
];

const defaultTheme = {
    Keyword: "#159393b",
    Identifier: "#516aec",
    Boolean: "#159393",
    Null: "#159393",
    String: "#159393",
    RegExp: "#159393",
    Comment: "#9e8f9e"
};

const defaultOptions = {
    fontFamily: "monospace",
    fontSize: 12,
    width: 200,
    height: "auto",
    plugins: defaultPlugins,
    theme: defaultTheme
};

function mergeWithDefaultOptions(options = defaultOptions) {
    const theme = {
        ...defaultOptions.theme,
        ...options.theme
    };
    
    return {
        ...defaultOptions,
        ...options,
        theme,
    };
}

export function toSVG(code, options = defaultOptions) {
    var ast = espree.parse(code, {
        // attach range information to each node
        range: true,
        // attach line/column location information to each node
        loc: true,
        // create a top-level comments array containing all comments
        comment: true,
        // attach comments to the closest relevant node as leadingComments and
        // trailingComments
        attachComment: true,
        // create a top-level tokens array containing all tokens
        tokens: true,
        // specify the language version (3, 5, 6, or 7, default is 5)
        ecmaVersion: 7,
        // specify which type of script you're parsing (script or module, default is script)
        sourceType: "module",
        // specify additional language features
        ecmaFeatures: {
            // enable JSX parsing
            jsx: true,
            // enable return in global scope
            globalReturn: true,
            // enable implied strict mode (if ecmaVersion >= 5)
            impliedStrict: true,
            // allow experimental object rest/spread
            experimentalObjectRestSpread: true
        }
    });
    
    options = mergeWithDefaultOptions(options);
    
    options.css = Object.entries(options.theme)
        .map(([ type, color ]) => `.${type} { fill: ${color}; }`)
        .join("\n");
    
    return astToSVG(ast, options);
}