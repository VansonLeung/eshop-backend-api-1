import { _APIGenericAssociations } from "./_APIGenericAssociations.js";
import { Op } from 'sequelize';

export const _APIGenericCRUD = {
    initialize: ({
        app,
        appWithMeta,
        collectionName,
        collectionModel,
    }) => {
                
        // Create a Item
        appWithMeta.post(`/api/${collectionName}`, {
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: `#/components/schemas/${collectionName}`,
                        }
                    }
                }
            }
        }, async (req, res) => {
            try {
                const item = await collectionModel.create(req.body);
                res.status(201).json(item);
            } catch (error) {
                res.status(400).json({ error: error.message });
                throw error;
            }
        });

        // Read all Items
        appWithMeta.get(`/api/${collectionName}`, {
            parameters: [
                { in: "query", name: "filter", schema: {type: "string", default: ""}, description: "`whereClause` as *JSON string*, recursive; Supports: `$like`, `$gt`, `$lt`, `$gte`, `$lte`, `$in`, `$not`, `$notIn`<br/>Example: <br/>`{  \"where\": {  \"$or\": [{ \"authorId\": 12 }, { \"authorId\": 13 }]  } }` ", },
                { in: "query", name: "sort", schema: {type: "string", default: ""}, description: "`orderClause` as *JSON string*, <br/>Example: <br/>`['title', 'DESC']`<br/>`[['title', 'ASC'], ['max(age)', 'ASC']]` ", },
                { in: "query", name: "group", schema: {type: "string", default: ""}, description: "`groupClause` as *string*", },
                { in: "query", name: "join", schema: {type: "string", default: ""}, description: "`includeClause` as *JSON string*, <br/>Example: <br/>`{ include: { association: 'Instruments' } }` ", },
                { in: "query", name: "offset", schema: {type: "number", default: ""}, description: "`offsetClause` as *number*, <br/>Example: <br/>`10` ", },
                { in: "query", name: "limit", schema: {type: "number", default: ""}, description: "`limitClause` as *number*, <br/>Example: <br/>`5` ", },
                { in: "query", name: "isCount", schema: {type: "boolean", default: ""}, description: "if `isCount` is `true`, the response data shall be a count of the query rows.", },
            ],
        }, async (req, res) => {
            try {
                const { filter, sort, group, join, offset, limit, isCount = false,  } = req.query; // Extract filter, sort, and join from query parameters
        
                // Build the where clause for filtering
                const whereClause = filter ? JSON.parse(filter) : undefined; // Assuming filter is a JSON string

                const recursiveMassageWhereClause = (whereClause) => {
                    const keys = Object.keys(whereClause);
                    for (var k in keys) {
                        if (keys[k] === "$like") { whereClause[Op.like] = whereClause.$like; delete whereClause.$like; }
                        else if (keys[k] === "$gt") { whereClause[Op.gt] = whereClause.$gt; delete whereClause.$gt; }
                        else if (keys[k] === "$lt") { whereClause[Op.lt] = whereClause.$lt; delete whereClause.$lt; }
                        else if (keys[k] === "$gte") { whereClause[Op.gte] = whereClause.$gte; delete whereClause.$gte; }
                        else if (keys[k] === "$lte") { whereClause[Op.lte] = whereClause.$lte; delete whereClause.$lte; }
                        else if (keys[k] === "$in") { whereClause[Op.in] = whereClause.$in; delete whereClause.$in; }
                        else if (keys[k] === "$not") { whereClause[Op.not] = whereClause.$not; delete whereClause.$not; }
                        else if (keys[k] === "$notIn") { whereClause[Op.notIn] = whereClause.$notIn; delete whereClause.$notIn; }
                    }
                    for (var k in whereClause) {
                        const val = whereClause[k];
                        if (val && typeof(val) === 'object') {
                            recursiveMassageWhereClause(val);
                        }
                    }
                }

                if (whereClause) {
                    recursiveMassageWhereClause(whereClause);
                }

                // Build the order clause for sorting
                // format: ['title', 'DESC']
                // format: [['title', 'DESC'], ['max(age)', 'DESC']]
                const orderClause = sort ? JSON.parse(sort) : undefined; // Split by comma for multiple fields

                // Build the group clause for grouping
                const groupClause = group || undefined;
                
                // Build the include clause for joining
                const includeClause = join ? JSON.parse(join) : undefined;

                // Build the offset clause for offseting
                const offsetClause = offset || undefined;
                
                // Build the limit clause for limiting
                const limitClause = limit || undefined;

                if (isCount) {
                    const count = await collectionModel.count({
                        ...whereClause ? {where: whereClause} : null,
                        ...orderClause ? {order: orderClause} : null,
                        ...groupClause !== undefined ? {group: groupClause} : null,
                        ...includeClause ? {include: includeClause} : null,
                        ...offsetClause !== undefined ? {offset: Number(offsetClause)} : null,
                        ...limitClause !== undefined ? {limit: Number(limitClause)} : null,
                    });
                    res.json(count);
                    return;    
                }

                const items = await collectionModel.findAll({
                    ...whereClause ? {where: whereClause} : null,
                    ...orderClause ? {order: orderClause} : null,
                    ...groupClause !== undefined ? {group: groupClause} : null,
                    ...includeClause ? {include: includeClause} : null,
                    ...offsetClause !== undefined ? {offset: Number(offsetClause)} : null,
                    ...limitClause !== undefined ? {limit: Number(limitClause)} : null,
                });
                res.json(items);
            } catch (error) {
                res.status(500).json({ error: error.message });
                throw error;
            }
        });

        // Read a Item by ID
        appWithMeta.get(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
        }, async (req, res) => {
            try {
                const item = await collectionModel.findByPk(req.params.id);
                if (item) {
                    res.json(item);
                } else {
                    res.status(404).json({ error: `${collectionName} not found` });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
                throw error;
            }
        });

        // Update a Item
        appWithMeta.put(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: `#/components/schemas/${collectionName}`,
                        }
                    }
                }
            }
        }, async (req, res) => {
            try {
                const [updated] = await collectionModel.update(req.body, {
                    where: { id: req.params.id }
                });
                if (updated) {
                    const updatedItem = await collectionModel.findByPk(req.params.id);
                    res.json(updatedItem);
                } else {
                    res.status(404).json({ error: `${collectionName} not found` });
                }
            } catch (error) {
                res.status(400).json({ error: error.message });
                throw error;
            }
        });

        // Delete a Item
        appWithMeta.delete(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],            
        }, async (req, res) => {
            try {
                const deleted = await collectionModel.destroy({
                    where: { id: req.params.id }
                });
                if (deleted) {
                    res.status(204).send();
                } else {
                    res.status(404).json({ error: `${collectionName} not found` });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
                throw error;
            }
        });

        _APIGenericAssociations.initialize({
            app,
            appWithMeta,
            collectionName,
            collectionModel,
        });
    }
}

