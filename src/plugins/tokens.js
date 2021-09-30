// LICENSE : MIT
"use strict";
import groupBy from "../utils/groupby.js";
export default function tokens(ast, options = {}){
    const fontSize = options.fontSize;
    const tokensByLine = groupBy(ast.tokens, (token) => {
        return token.loc.start.line;
    });
    return Object.entries(tokensByLine).map(([ line, tokens ]) => {
        const x = tokens[0].loc.start.column;
        const y = tokens[0].loc.start.line;
        const tspans = tokens.map((token, index) => {
            const prevToken = tokens[index - 1];
            let margin = "";
            if (prevToken) {
                margin = " ".repeat(token.start - prevToken.end);
            }
            return `${margin}<tspan class="${token.type}">${token.value}</tspan>`;
        });
        return `<text x="${x * options.charWidth}" y="${y * fontSize}">${tspans.join("")}</text>`;
    });
}