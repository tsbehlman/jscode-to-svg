// LICENSE : MIT
"use strict";
import { parse } from "espree";
import astToSVG from "./ast-to-svg.js";
import commentsPlugin  from "./plugins/comments.js";
import splitMultilineTokensPlugin from "./plugins/splitMultilineTokens.js";
import tokensPlugin from "./plugins/tokens.js";

const defaultParsingOptions = {
    loc: true,
    comment: true,
    tokens: true,
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
        jsx: true,
        globalReturn: true
    }
};

function mergeWithDefaultParsingOptions(parsingOptions = defaultParsingOptions) {
    return {
        ...defaultParsingOptions,
        ...parsingOptions,
        ecmaFeatures: {
            ...defaultParsingOptions.ecmaFeatures,
            ...parsingOptions.ecmaFeatures
        }
    };
}

const defaultPlugins = [
    commentsPlugin,
    splitMultilineTokensPlugin,
    tokensPlugin
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

export function toSVG(code, parsingOptions, formattingOptions) {
    parsingOptions = mergeWithDefaultParsingOptions(parsingOptions);
    
    const ast = parse(code, parsingOptions);
    
    formattingOptions = mergeWithDefaultFormattingOptions(formattingOptions);
    
    return astToSVG(ast, formattingOptions);
}