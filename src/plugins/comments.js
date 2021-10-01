// LICENSE : MIT
"use strict";
import groupBy from "../utils/groupby.js";
import splitMultilineTokens from "../utils/splitMultilineTokens.js";

function addDelimitersToComments(comments) {
    return comments.map(comment => ({
        ...comment,
        value: comment.type === "Block"
            ? `/*${comment.value}*/`
            : `//${comment.value}`
    }));
}

export default function commentsTo(ast, options) {
    const commentsByLine = groupBy(splitMultilineTokens(addDelimitersToComments(ast.comments)), (comment) => {
        return comment.loc.start.line;
    });
    return Object.entries(commentsByLine).map(([ line, comments ]) => {
        const y = comments[0].loc.start.line * options.lineHeight;
        const lineMargin = " ".repeat(comments[0].loc.start.column);
        const tspans = comments.map((comment, index) => {
            const prevToken = comments[index - 1];
            let margin = "";
            if (prevToken) {
                margin = " ".repeat(token.start - prevToken.end);
            }
            return `${margin}<tspan class="Comment ${comment.type}">${comment.value}</tspan>`;
        });
        return `<text y="${y}">${lineMargin}${tspans.join("")}</text>`;
    });
}