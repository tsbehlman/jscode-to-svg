// LICENSE : MIT
"use strict";

function addDelimitersToComments(comments) {
    return comments.map(comment => ({
        ...comment,
        type: `Comment ${comment.type}`,
        value: comment.type === "Block"
            ? `/*${comment.value}*/`
            : `//${comment.value}`
    }));
}

export default function comments(ast, options) {
    ast.tokens = ast.tokens
        .concat(addDelimitersToComments(ast.comments))
        .sort((a, b) => a.start - b.start);
}