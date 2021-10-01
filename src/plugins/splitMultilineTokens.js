// LICENSE : MIT
"use strict";

export default function splitMultilineTokens(ast, options) {
    const splitTokens = [];
    
    for (const token of ast.tokens) {
        const { start, end } = token.loc;
        if (start.line === end.line) {
            splitTokens.push(token);
        } else {
            const lines = token.value.split(/\r?\n/g);
            lines.forEach((line, lineOffset) => {
                splitTokens.push({
                    ...token,
                    value: line,
                    loc: {
                        start: {
                            line: start.line + lineOffset,
                            column: lineOffset === 0
                                ? start.column
                                : 0
                        },
                        end: {
                            line: start.line + lineOffset,
                            column: lineOffset === 0
                                ? end.column + line.length
                                : line.length
                        }
                    }
                });
            });
        }
    }
    
    ast.tokens = splitTokens;
}