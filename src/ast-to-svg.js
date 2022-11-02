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
        let longestColumn = ast.tokens.reduce(
            (longestColumn, token) => Math.max(token.columnNumber + token.value.length, longestColumn),
            0
        );
        viewWidth = Math.round( longestColumn * options.charWidth );
    } else {
        viewWidth = options.width;
    }
    
    let viewHeight;
    if (options.width === "auto") {
        viewHeight = ( ast.tokens[ast.tokens.length - 1].lineNumber + 1 ) * options.lineHeight;
    } else {
        viewHeight = options.height;
    }
    
    const tokenTypes = new Set(ast.tokens.map(token => token.type.split(" ")).flat());
    
    const themeCSS = Object.entries(options.theme)
            .filter(([type]) => tokenTypes.has(type))
            .map(([ type, color ]) => `.${type} { fill: ${color}; }`)
            .join("\n");

    const css = `
text, tspan {
    white-space: pre;
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