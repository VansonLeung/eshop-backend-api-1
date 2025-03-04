
export const SchemaToIndexes = (schema) => {
    const indexes = [];

    const aggregateIndexGroups = {};

    for (var key in schema) {
        const attribute = schema[key] || {};
        
        const index = attribute.index;
        const indexGroups = attribute.indexGroups;

        if (index) {
            indexes.push({
                fields: [`${key}`],
            })
        }

        if (indexGroups) {
            for (var k in indexGroups) {
                var indexGroupName = indexGroups[k].name;
                var indexGroupOrder = indexGroups[k].order;
                aggregateIndexGroups[indexGroupName] = aggregateIndexGroups[indexGroupName] || {};
                aggregateIndexGroups[indexGroupName][indexGroupOrder] = key;
            }
        }
    }

    if (Object.keys(aggregateIndexGroups).length > 0) {
        for (var indexGroupKey in aggregateIndexGroups) {
            const transformedArray = Object.keys(aggregateIndexGroups[indexGroupKey])
            .sort()
            .map(fieldKey => aggregateIndexGroups[indexGroupKey][fieldKey]);

            indexes.splice(0, 0, {
                fields: transformedArray,
            })
        }
    }

    return indexes;
}
