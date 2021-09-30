export default function process(ast, options) {
    let contents = [];
    options.plugins.forEach(plugin => {
        const nodes = plugin(ast, options);
        if (Array.isArray(nodes)) {
            contents = contents.concat(nodes);
        }
    });
    const viewWidth = options.width;
    const viewHeight = options.height === "auto"
        ? ( ast.loc.end.line + 1 ) * options.fontSize
        : options.height;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewWidth} ${viewHeight}">
    <style>${options.css}</style>
    <g id="jscode-to-svg-container" font-family="${options.fontFamily}" font-size="${options.fontSize}">
${contents.join("\n")}
    </g>
</svg>`
}