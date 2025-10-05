import { GenericAssociations } from "./GenericAssociations.js";
import { recursiveMassageIncludeClause } from "./utils/QueryIncludeClauseMassager.js";
import { recursiveMassageWhereClause } from './utils/QueryWhereClauseMassager.js';

// Import plugin manager but make it optional
let pluginManager = null;
try {
    const module = await import('../plugins/PluginManager.js');
    pluginManager = module.pluginManager;
} catch (e) {
    // Plugin system not available, that's OK
}

export const GenericCRUD = {
    initialize: ({
        app,
        appWithMeta,
        collectionName,
        collectionModel,
        usePlugins = false, // Optional: enable plugin hooks
        aclMiddleware = null, // Optional: ACL middleware for specific routes
    }) => {

        // Helper to execute plugin hooks if enabled
        const executeHook = async (hookName, context) => {
            if (usePlugins && pluginManager) {
                return await pluginManager.executeHook(hookName, context);
            }
            return context;
        };

        const executeModifierHook = async (hookName, data, context) => {
            if (usePlugins && pluginManager) {
                return await pluginManager.executeModifierHook(hookName, data, context);
            }
            return data;
        };

        // Helper to build middleware array (filters out undefined)
        const buildMiddleware = (...middlewares) => {
            return middlewares.filter(m => m !== undefined && m !== null);
        };

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
        }, ...buildMiddleware(aclMiddleware?.create), async (req, res) => {
            try {
                // Execute beforeCreate hooks
                const beforeContext = await executeHook('beforeCreate', {
                    req, res,
                    model: collectionName,
                    action: 'create',
                    data: req.body,
                });

                if (beforeContext.cancel) return;

                const item = await collectionModel.create(beforeContext.data || req.body);

                // Execute afterCreate hooks
                await executeHook('afterCreate', {
                    req, res,
                    model: collectionName,
                    action: 'create',
                    data: item,
                });

                res.sendResponse({status: 201, data: item, });
            } catch (error) {
                await executeHook('onError', { req, res, model: collectionName, action: 'create', error });
                res.sendError({error, });
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
        }, ...buildMiddleware(aclMiddleware?.read), async (req, res) => {
            try {
                // Execute beforeRead hooks
                const beforeContext = await executeHook('beforeRead', {
                    req, res,
                    model: collectionName,
                    action: 'read',
                });

                if (beforeContext.cancel) return;

                const { filter, sort, group, join, offset, limit, isCount = false,  } = req.query;

                // Build the where clause for filtering
                const whereClause = filter ? JSON.parse(filter) : undefined;

                if (whereClause) {
                    recursiveMassageWhereClause(whereClause);
                }

                // Build the order clause for sorting
                const orderClause = sort ? JSON.parse(sort) : undefined;

                // Build the group clause for grouping
                const groupClause = group || undefined;

                // Build the include clause for joining
                let includeClause = join ? JSON.parse(join) : undefined;

                if (includeClause) {
                    recursiveMassageIncludeClause(includeClause);
                }

                // Build query options
                let queryOptions = {
                    ...whereClause ? {where: whereClause} : null,
                    ...orderClause ? {order: orderClause} : null,
                    ...groupClause !== undefined ? {group: groupClause} : null,
                    ...includeClause ? {include: includeClause} : null,
                    ...offset !== undefined ? {offset: Number(offset)} : null,
                    ...limit !== undefined ? {limit: Number(limit)} : null,
                };

                // Apply modifyQuery hooks (e.g., filter JOINs by ACL)
                queryOptions = await executeModifierHook('modifyQuery', queryOptions, {
                    req, res,
                    model: collectionName,
                    action: 'read',
                });

                if (isCount && !(isCount === "false" || isCount === "False")) {
                    const count = await collectionModel.count(queryOptions);
                    res.sendResponse({status: 200, data: count, });
                    return;
                }

                let items = await collectionModel.findAll(queryOptions);

                // Apply modifyResponse hooks
                items = await executeModifierHook('modifyResponse', items, {
                    req, res,
                    model: collectionName,
                    action: 'read',
                });

                // Execute afterRead hooks
                await executeHook('afterRead', {
                    req, res,
                    model: collectionName,
                    action: 'read',
                    data: items,
                });

                res.sendResponse({status: 200, data: items, });
            } catch (error) {
                await executeHook('onError', { req, res, model: collectionName, action: 'read', error });
                res.sendError({error, });
                throw error;
            }
        });

        // Read a Item by ID
        appWithMeta.get(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } },
                { in: "query", name: "join", schema: {type: "string", default: ""}, description: "`includeClause` as *JSON string*, <br/>Example: <br/>`{ include: { association: 'Instruments' } }` ", },
            ],
        }, ...buildMiddleware(aclMiddleware?.read), async (req, res) => {
            try {
                // Execute beforeRead hooks
                const beforeContext = await executeHook('beforeRead', {
                    req, res,
                    model: collectionName,
                    action: 'read',
                    id: req.params.id,
                });

                if (beforeContext.cancel) return;

                const { join, } = req.query;

                // Build the include clause for joining
                let includeClause = join ? JSON.parse(join) : undefined;

                if (includeClause) {
                    recursiveMassageIncludeClause(includeClause);
                }

                // Build query options
                let queryOptions = {
                    ...includeClause ? {include: includeClause} : null,
                };

                // Apply modifyQuery hooks
                queryOptions = await executeModifierHook('modifyQuery', queryOptions, {
                    req, res,
                    model: collectionName,
                    action: 'read',
                });

                let item = await collectionModel.findByPk(req.params.id, queryOptions);

                if (item) {
                    // Apply modifyResponse hooks
                    item = await executeModifierHook('modifyResponse', item, {
                        req, res,
                        model: collectionName,
                        action: 'read',
                    });

                    // Execute afterRead hooks
                    await executeHook('afterRead', {
                        req, res,
                        model: collectionName,
                        action: 'read',
                        data: item,
                    });

                    res.sendResponse({status: 200, data: item, });
                } else {
                    res.sendError({status: 404, error: new Error(`${collectionName} not found`), });
                }
            } catch (error) {
                await executeHook('onError', { req, res, model: collectionName, action: 'read', error });
                res.sendError({error, });
                throw error;
            }
        });

        // Update a Item
        appWithMeta.put(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } }
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
        }, ...buildMiddleware(aclMiddleware?.update), async (req, res) => {
            try {
                // Execute beforeUpdate hooks
                const beforeContext = await executeHook('beforeUpdate', {
                    req, res,
                    model: collectionName,
                    action: 'update',
                    id: req.params.id,
                    data: req.body,
                });

                if (beforeContext.cancel) return;

                const [updated] = await collectionModel.update(beforeContext.data || req.body, {
                    where: { id: req.params.id }
                });

                if (updated) {
                    const updatedItem = await collectionModel.findByPk(req.params.id);

                    // Execute afterUpdate hooks
                    await executeHook('afterUpdate', {
                        req, res,
                        model: collectionName,
                        action: 'update',
                        data: updatedItem,
                    });

                    res.sendResponse({status: 201, data: updatedItem, });
                } else {
                    res.sendError({status: 404, error: new Error(`${collectionName} not found`), });
                }
            } catch (error) {
                await executeHook('onError', { req, res, model: collectionName, action: 'update', error });
                res.sendError({error, });
                throw error;
            }
        });

        // Delete a Item
        appWithMeta.delete(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } }
            ],
        }, ...buildMiddleware(aclMiddleware?.delete), async (req, res) => {
            try {
                // Execute beforeDelete hooks
                const beforeContext = await executeHook('beforeDelete', {
                    req, res,
                    model: collectionName,
                    action: 'delete',
                    id: req.params.id,
                });

                if (beforeContext.cancel) return;

                const deleted = await collectionModel.destroy({
                    where: { id: req.params.id }
                });

                if (deleted) {
                    // Execute afterDelete hooks
                    await executeHook('afterDelete', {
                        req, res,
                        model: collectionName,
                        action: 'delete',
                        id: req.params.id,
                    });

                    res.sendResponse({status: 200, data: { deleted: true }});
                } else {
                    res.sendError({status: 404, error: new Error(`${collectionName} not found`), });
                }
            } catch (error) {
                await executeHook('onError', { req, res, model: collectionName, action: 'delete', error });
                res.sendError({error, });
                throw error;
            }
        });

        // Bulk create / update items
        appWithMeta.post(`/api/${collectionName}/bulk`, {
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: `#/components/schemas/${collectionName}`,
                            }
                        }
                    }
                }
            }
        }, ...buildMiddleware(aclMiddleware?.create), async (req, res) => {
            try {
                const responseData = [];
                for (const item of req.body) {
                    const [upsertedItem, isCreated] = await collectionModel.upsert(item);
                    responseData.push({upsertedItem, isCreated});
                }
                res.sendResponse({status: 201, data: true, });
            } catch (error) {
                await executeHook('onError', { req, res, model: collectionName, action: 'bulk-create', error });
                res.sendError({error, });
                throw error;
            }
        });


        // Bulk delete items
        appWithMeta.delete(`/api/${collectionName}/:ids/bulk`, {
            parameters: [
                { name: 'ids', in: 'path', required: true, schema: { type: 'array', default: [] } }
            ],
        }, ...buildMiddleware(aclMiddleware?.delete), async (req, res) => {
            try {
                if (!req.params.ids || req.params.ids.length === 0) {
                    res.sendResponse({status: 400, error: new Error(`No IDs provided`), });
                    return;
                }

                const deleted = await collectionModel.destroy({
                    where: { id: req.params.ids || [] }
                });

                if (deleted) {
                    res.sendResponse({status: 200, data: { deleted }});
                } else {
                    res.sendError({status: 404, error: new Error(`${collectionName} not found`), });
                }
            } catch (error) {
                await executeHook('onError', { req, res, model: collectionName, action: 'bulk-delete', error });
                res.sendError({error, });
                throw error;
            }
        });

        GenericAssociations.initialize({
            app,
            appWithMeta,
            collectionName,
            collectionModel,
        });
    }
}
