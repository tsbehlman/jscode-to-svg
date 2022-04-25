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
    
    const tokenTypes = new Set(ast.tokens.map(token => token.type.split(" ")).flat());
    
    const themeCSS = Object.entries(options.theme)
            .filter(([type]) => tokenTypes.has(type))
            .map(([ type, color ]) => `.${type} { fill: ${color}; }`)
            .join("\n");

    const css = `
* {
    white-space: pre;
}
svg {
    font-size: ${options.fontSize}px;
    font-family: ${options.fontFamily};
}
${themeCSS}
`;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${viewWidth}" height="${viewHeight}" viewBox="0 0 ${viewWidth} ${viewHeight}">
<style>${css}</style>
${contents.join("\n")}
</svg>`
}