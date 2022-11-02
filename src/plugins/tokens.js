// LICENSE : MIT
"use strict";

import groupBy from "../utils/groupBy.js";

function isTokenStyled(token, options) {
    return token.type.split(" ").some(type => type in options.theme);
}

export default function tokens(ast, options) {
    const tokensByLine = groupBy(ast.tokens, token => token.lineNumber);
    
    return Array.from(tokensByLine).map(([ line, tokens ]) => {
        const y = tokens[0].lineNumber * options.lineHeight;
        if (tokens.length === 1) {
            const [token] = tokens;
            const sanitizedTokenValue = token.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
            if (isTokenStyled(token, options)) {
                return `<text y="${y}" class="${token.type}">${sanitizedTokenValue}</text>`;
            } else {
                return `<text y="${y}">${sanitizedTokenValue}</text>`;
            }
        } else {
            const tspans = tokens.map((token, index) => {
                const sanitizedTokenValue = token.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
                if (isTokenStyled(token, options)) {
                    return `<tspan class="${token.type}">${sanitizedTokenValue}</tspan>`;
                } else {
                    return sanitizedTokenValue;
                }
            });
            return `<text y="${y}">${tspans.join("")}</text>`;
        }
    });
}