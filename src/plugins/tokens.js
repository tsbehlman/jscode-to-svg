// LICENSE : MIT
"use strict";
import groupBy from "../utils/groupby.js";
import splitMultilineTokens from "../utils/splitMultilineTokens.js";
export default function tokens(ast, options = {}){
    const tokensByLine = groupBy(splitMultilineTokens(ast.tokens), (token) => {
        return token.loc.start.line;
    });
    return Object.entries(tokensByLine).map(([ line, tokens ]) => {
        const y = tokens[0].loc.start.line * options.lineHeight;
        const lineMargin = " ".repeat(tokens[0].loc.start.column);
        const tspans = tokens.map((token, index) => {
            const prevToken = tokens[index - 1];
            let margin = "";
            if (prevToken) {
                margin = " ".repeat(token.start - prevToken.end);
            }
            return `${margin}<tspan class="${token.type}">${token.value}</tspan>`;
        });
        return `<text y="${y}">${lineMargin}${tspans.join("")}</text>`;
    });
}