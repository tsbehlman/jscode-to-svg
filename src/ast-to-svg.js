export default function process(ast, options) {
    let contents = [];
    options.plugins.forEach(plugin => {
        const nodes = plugin(ast, options);
        if (Array.isArray(nodes)) {
            contents = contents.concat(nodes);
        }
    });
    
    let viewWidth;
    if (options.width === "auto") {
        let highestColumn = 0;
        highestColumn = ast.tokens.reduce(
            (highestColumn, token) => Math.max(token.loc.end.column, highestColumn),
            highestColumn
        );
        highestColumn = ast.comments.reduce(
            (highestColumn, comment) => Math.max(comment.loc.end.column, highestColumn),
            highestColumn
        );
        viewWidth = Math.round( highestColumn * options.charWidth );
    } else {
        viewWidth = options.width;
    }
    
    let viewHeight;
    if (options.width === "auto") {
        viewHeight = ( ast.loc.end.line + 1 ) * options.lineHeight;
    } else {
        viewHeight = options.height;
    }
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${viewWidth}" height="${viewHeight}" viewBox="0 0 ${viewWidth} ${viewHeight}">
    <style>${options.css}</style>
    <g id="jscode-to-svg-container" font-family="${options.fontFamily}" font-size="${options.fontSize}">
${contents.join("\n")}
    </g>
</svg>`
}