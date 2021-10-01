export default function splitMultilineTokens(tokens) {
    const splitTokens = [];
    
    for (const token of tokens) {
        const { start, end } = token.loc;
        if (start.line === end.line) {
            splitTokens.push(token);
        } else {
            const lines = token.value.split(/\r?\n/g);
            lines.forEach((line, lineOffset) => {
                const trimmedLine = line.trimStart();
                const columnOffset = line.length - trimmedLine.length;
                splitTokens.push({
                    ...token,
                    value: trimmedLine,
                    loc: {
                        start: {
                            line: start.line + lineOffset,
                            column: lineOffset === 0
                                ? start.column
                                : columnOffset
                        },
                        end: {
                            line: start.line + lineOffset,
                            column: lineOffset === 0
                                ? end.column + line.length
                                : line.length
                        }
                    }
                });
            });
        }
    }
    
    return splitTokens;
}