import { recursiveMassageWhereClause } from './utils/QueryWhereClauseMassager.js';
import { recursiveMassageIncludeClause } from './utils/QueryIncludeClauseMassager.js';

export class APIGenericCRUD {
    static initialize({
        app,
        appWithMeta,
        collectionName,
        collectionModel,
    }) {
        // Get all items
        appWithMeta.get(`/api/${collectionName}`, {
            parameters: [
                { name: 'filter', in: 'query', schema: { type: 'object', default: {} } },
                { name: 'sort', in: 'query', schema: { type: 'array', default: [] } },
                { name: 'join', in: 'query', schema: { type: 'array', default: [] } },
                { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 100 } }
            ],
        }, async (req, res) => {
            try {
                const whereClause = req.query.filter || {};
                if (Object.keys(whereClause).length > 0) {
                    recursiveMassageWhereClause(whereClause);
                }
                const includeClause = req.query.join || [];
                if (includeClause.length > 0) {
                    recursiveMassageIncludeClause(includeClause);
                }
                const orderClause = req.query.sort || [];
                const offset = parseInt(req.query.offset) || 0;
                const limit = parseInt(req.query.limit) || 100;

                const items = await collectionModel.findAll({
                    where: whereClause,
                    include: includeClause,
                    order: orderClause,
                    offset,
                    limit,
                });

                res.sendResponse({status: 200, data: items, });
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });

        // Get item by ID
        appWithMeta.get(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
                { name: 'join', in: 'query', schema: { type: 'array', default: [] } }
            ],
        }, async (req, res) => {
            try {
                const includeClause = req.query.join || [];
                if (includeClause.length > 0) {
                    recursiveMassageIncludeClause(includeClause);
                }

                const item = await collectionModel.findByPk(req.params.id, {
                    include: includeClause,
                });

                if (item) {
                    res.sendResponse({status: 200, data: item, });
                } else {
                    res.sendError({status: 404, error: new Error(`${collectionName} not found`), });
                }
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });

        // Create new item
        appWithMeta.post(`/api/${collectionName}`, {
            requestBody: {
                content: {
                    'application/json': {
                        schema: { type: 'object' }
                    }
                }
            },
        }, async (req, res) => {
            try {
                const newItem = await collectionModel.create(req.body);
                res.sendResponse({status: 201, data: newItem, });
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });

        // Update item by ID
        appWithMeta.put(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: { type: 'object' }
                    }
                }
            },
        }, async (req, res) => {
            try {
                const [updatedRowsCount] = await collectionModel.update(req.body, {
                    where: { id: req.params.id }
                });

                if (updatedRowsCount > 0) {
                    const updatedItem = await collectionModel.findByPk(req.params.id);
                    res.sendResponse({status: 200, data: updatedItem, });
                } else {
                    res.sendError({status: 404, error: new Error(`${collectionName} not found`), });
                }
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });

        // Delete item by ID
        appWithMeta.delete(`/api/${collectionName}/:id`, {
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
            ],
        }, async (req, res) => {
            try {
                const deleted = await collectionModel.destroy({
                    where: { id: req.params.id }
                });

                if (deleted) {
                    res.sendResponse({status: 204});
                } else {
                    res.sendError({status: 404, error: new Error(`${collectionName} not found`), });
                }
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });

        // Bulk upsert items
        appWithMeta.post(`/api/${collectionName}/bulk`, {
            requestBody: {
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { type: 'object' } }
                    }
                }
            },
        }, async (req, res) => {
            try {
                const responseData = [];
                for (const item of req.body) {
                    const [upsertedItem, isCreated] = await collectionModel.upsert(item);
                    responseData.push({upsertedItem, isCreated});
                }
                res.sendResponse({status: 201, data: true, });
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });

        // Bulk delete items
        appWithMeta.delete(`/api/${collectionName}/:ids/bulk`, {
            parameters: [
                { name: 'ids', in: 'path', required: true, schema: { type: 'array', default: [] } }
            ],
        }, async (req, res) => {
            try {
                if (!req.params.ids || req.params.ids.length === 0) {
                    res.sendResponse({status: 400, error: new Error(`No IDs provided`), });
                    return;
                }

                const deleted = await collectionModel.destroy({
                    where: { id: req.params.ids || [] }
                });

                if (deleted) {
                    res.sendResponse({status: 204});
                } else {
                    res.sendError({status: 404, error: new Error(`${collectionName} not found`), });
                }
            } catch (error) {
                res.sendError({error, });
                throw error;
            }
        });

        // Note: _APIGenericAssociations.initialize will be called from the application layer
        // since associations are domain-specific and not part of the generic CRUD framework
    }
}