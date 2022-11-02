// LICENSE : MIT
"use strict";

export default function splitMultilineTokens(ast, options) {
    const splitTokens = [];
    let lineNumber = 1;
    let columnNumber = 0;
    
    for (const token of ast.tokens) {
        const lines = token.value.split(/\r?\n/g);
        lines.forEach((line, lineOffset) => {
            if (lineOffset > 0) {
                lineNumber += 1;
                columnNumber = 0;
            }
            if (line.length > 0) {
                splitTokens.push({
                    ...token,
                    value: line,
                    lineNumber,
                    columnNumber,
                });
            }
            columnNumber += line.length;
        });
    }
    
    ast.tokens = splitTokens;
}