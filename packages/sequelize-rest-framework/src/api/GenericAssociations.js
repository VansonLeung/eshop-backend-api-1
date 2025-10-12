import { recursiveMassageIncludeClause } from '../api/utils/QueryIncludeClauseMassager.js';
import { recursiveMassageWhereClause } from '../api/utils/QueryWhereClauseMassager.js';

export class GenericAssociations {
    static initialize({
        app,
        appWithMeta,
        collectionName,
        collectionModel,
    }) {
        if (!collectionModel) {
            return;
        }

        const associations = collectionModel.associations || {};

        for (const key in associations) {
            const targetName = associations[key].target.name;
            const targetModel = associations[key].target;
            const actions = associations[key].accessors;
            const isMultiple = associations[key].isMultiAssociation;

            for (const actionKey in actions) {
                const itemActionFnKey = actions[actionKey];

                if (actionKey === "create") {
                    appWithMeta.post(`/api/${collectionName}/:id/${key}/${actionKey}`, {
                        parameters: [
                            { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } }
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: `#/components/schemas/${targetName}`,
                                    }
                                }
                            }
                        }
                    }, async (req, res) => {
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);
                            const item = await srcItem[itemActionFnKey](req.body);
                            res.sendResponse({status: 201, data: item, });
                        } catch (error) {
                            res.sendError({error, });
                        }
                    });
                }

                else if (actionKey === "set") {
                    appWithMeta.patch(`/api/${collectionName}/:id/${key}/${actionKey}/:targetIds`, {
                        parameters: [
                            { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } },
                            { name: 'targetIds', in: 'path', required: true, schema: { type: 'string', default: "" }, description: "id value(s) separated by `,`", },
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: `#/components/schemas/${targetName}`,
                                    }
                                }
                            }
                        }
                    }, async (req, res) => {
                        try {
                            if (isMultiple) {
                                const srcItem = await collectionModel.findByPk(req.params.id);

                                if (!srcItem) {
                                    res.sendError({status: 404, error: new Error(`${collectionName} ${req.params.id} not found`), });
                                    return;
                                }

                                const targetItemIds = req.params.targetIds.split(",");

                                const response = await srcItem[itemActionFnKey](targetItemIds);
                                res.sendResponse({status: 201, data: response, });

                            } else {
                                const srcItem = await collectionModel.findByPk(req.params.id);
                                const targetItem = await targetModel.findByPk(req.params.targetIds);

                                if (!srcItem) {
                                    res.sendError({status: 404, error: new Error(`${collectionName} ${req.params.id} not found`), });
                                    return;
                                }

                                if (!targetItem) {
                                    res.sendError({status: 404, error: new Error(`${key} ${req.params.targetIds} not found`), });
                                    return;
                                }

                                const response = await srcItem[itemActionFnKey](targetItem);
                                res.sendResponse({status: 201, data: response, });
                            }
                        } catch (error) {
                            res.sendError({error, });
                        }
                    });
                }

                else if (actionKey === "add") {
                    appWithMeta.patch(`/api/${collectionName}/:id/${key}/${actionKey}/:targetIds`, {
                        parameters: [
                            { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } },
                            { name: 'targetIds', in: 'path', required: true, schema: { type: 'string', default: "" }, description: "id value(s) separated by `,`", },
                        ]
                    }, async (req, res) => {
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);

                            if (!srcItem) {
                                res.sendError({status: 404, error: new Error(`${collectionName} ${req.params.id} not found`), });
                                return;
                            }

                            const targetItemIds = req.params.targetIds.split(",");
                            const targetItems = await targetModel.findAll({ where: { id: targetItemIds } });

                            if (targetItems.length !== targetItemIds.length) {
                                res.sendError({status: 404, error: new Error(`Some ${key} not found`), });
                                return;
                            }

                            const response = await srcItem[itemActionFnKey](targetItems);
                            res.sendResponse({status: 201, data: response, });
                        } catch (error) {
                            res.sendError({error, });
                        }
                    });
                }

                else if (actionKey === "remove") {
                    appWithMeta.patch(`/api/${collectionName}/:id/${key}/${actionKey}/:targetIds`, {
                        parameters: [
                            { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } },
                            { name: 'targetIds', in: 'path', required: true, schema: { type: 'string', default: "" }, description: "id value(s) separated by `,`", },
                        ]
                    }, async (req, res) => {
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);

                            if (!srcItem) {
                                res.sendError({status: 404, error: new Error(`${collectionName} ${req.params.id} not found`), });
                                return;
                            }

                            const targetItemIds = req.params.targetIds.split(",");
                            const targetItems = await targetModel.findAll({ where: { id: targetItemIds } });

                            if (targetItems.length !== targetItemIds.length) {
                                res.sendError({status: 404, error: new Error(`Some ${key} not found`), });
                                return;
                            }

                            const response = await srcItem[itemActionFnKey](targetItems);
                            res.sendResponse({status: 201, data: response, });
                        } catch (error) {
                            res.sendError({error, });
                        }
                    });
                }

                else if (actionKey === "count") {
                    appWithMeta.get(`/api/${collectionName}/:id/${key}/${actionKey}`, {
                        parameters: [
                            { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } }
                        ]
                    }, async (req, res) => {
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);

                            if (!srcItem) {
                                res.sendError({status: 404, error: new Error(`${collectionName} ${req.params.id} not found`), });
                                return;
                            }

                            const count = await srcItem[itemActionFnKey]();
                            res.sendResponse({status: 200, data: count, });
                        } catch (error) {
                            res.sendError({error, });
                        }
                    });
                }

                else if (actionKey === "get") {
                    appWithMeta.get(`/api/${collectionName}/:id/${key}/${actionKey}`, {
                        parameters: [
                            { name: 'id', in: 'path', required: true, schema: { type: 'string', default: "" } },
                            { name: 'include', in: 'query', schema: { type: 'string', default: "" }, description: "Include related models" },
                            { name: 'where', in: 'query', schema: { type: 'string', default: "" }, description: "Where clause" },
                            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: "Limit results" },
                            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 }, description: "Offset results" },
                            { name: 'order', in: 'query', schema: { type: 'string', default: "" }, description: "Order results" }
                        ]
                    }, async (req, res) => {
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);

                            if (!srcItem) {
                                res.sendError({status: 404, error: new Error(`${collectionName} ${req.params.id} not found`), });
                                return;
                            }

                            let options = {};

                            if (req.query.include) {
                                options.include = recursiveMassageIncludeClause(req.query.include);
                            }

                            if (req.query.where) {
                                options.where = recursiveMassageWhereClause(req.query.where);
                            }

                            if (req.query.limit) {
                                options.limit = parseInt(req.query.limit);
                            }

                            if (req.query.offset) {
                                options.offset = parseInt(req.query.offset);
                            }

                            if (req.query.order) {
                                options.order = JSON.parse(req.query.order);
                            }

                            const items = await srcItem[itemActionFnKey](options);
                            res.sendResponse({status: 200, data: items, });
                        } catch (error) {
                            res.sendError({error, });
                        }
                    });
                }
            }
        }
    }
}