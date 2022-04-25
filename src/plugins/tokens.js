// LICENSE : MIT
"use strict";

import groupBy from "../utils/groupby.js";

function isTokenStyled(token, options) {
    return token.type.split(" ").some(type => type in options.theme);
}

export default function tokens(ast, options = {}){
    const tokensByLine = groupBy(ast.tokens, token => token.loc.start.line);
    
    return Object.entries(tokensByLine).map(([ line, tokens ]) => {
        const y = tokens[0].loc.start.line * options.lineHeight;
        const lineMargin = " ".repeat(tokens[0].loc.start.column);
        if (tokens.length === 1) {
            const [token] = tokens;
            if (isTokenStyled(token, options)) {
                return `<text y="${y}" class="${token.type}">${lineMargin}${token.value}</text>`;
            } else {
                return `<text y="${y}">${lineMargin}${token.value}</text>`;
            }
        } else {
            const tspans = tokens.map((token, index) => {
                const prevToken = tokens[index - 1];
                let margin = "";
                if (prevToken) {
                    margin = " ".repeat(token.start - prevToken.end);
                }
                if (isTokenStyled(token, options)) {
                    return `${margin}<tspan class="${token.type}">${token.value}</tspan>`;
                } else {
                    return `${margin}${token.value}`
                }
            });
            return `<text y="${y}">${lineMargin}${tspans.join("")}</text>`;
        }
    });
}