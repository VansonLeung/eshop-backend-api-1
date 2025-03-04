
export const SchemaToIndexes = (schema) => {
    const indexes = [];

    for (var key in schema) {
        const attribute = schema[key] || {};
        const index = attribute.index;
        if (index) {
            indexes.push({
                fields: [`${key}`],
            })
        }
    }

    return indexes;
}
