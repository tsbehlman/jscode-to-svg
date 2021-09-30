// LICENSE : MIT
"use strict";
import groupBy from "../utils/groupby.js";
export default function commentsTo(ast, options) {
    const fontSize = options.fontSize;
    const commentsByLine = groupBy(ast.comments, (comment) => {
        return comment.loc.start.line;
    });
    return Object.entries(commentsByLine).map(([ line, comments ]) => {
        const x = comments[0].loc.start.column;
        const y = comments[0].loc.start.line;
        const tspans = comments.map((comment, index) => {
            // TODO: support multi line comment
            if (comment.type !== "Line") {
                return;
            }
            const prevToken = comments[index - 1];
            let margin = "";
            if (prevToken) {
                margin = " ".repeat(token.start - prevToken.end);
            }
            const value = `// ${comment.value}`;
            return `${margin}<tspan class="Comment ${comment.type}">${value}</tspan>`;
        }).filter((text) => text != null);
        return `<text x="${x * options.charWidth}" y="${y * fontSize}">${tspans.join("")}</text>`;
    });
}