export default function groupBy(items, keyGenerator) {
    const map = new Map();

    for (const item of items) {
        const key = keyGenerator(item);
        if (map.has(key)) {
            map.get(key).push(item);
        } else {
            map.set(key, [item]);
        }
    }

    return map;
}