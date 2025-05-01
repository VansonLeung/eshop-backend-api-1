import { Op } from 'sequelize';

export const _APIGenericAssociations = {
    initialize: ({
        app,
        collectionName,
        collectionModel,
    }) => {

        if (!collectionModel) {
            return;
        }

        const associations = collectionModel.associations || {};
        
        for (var key in associations) {
            const targetName = associations[key].target.name;
            const targetModel = associations[key].target;
            const actions = associations[key].accessors;
            const isMultiple = associations[key].isMultiAssociation;

            console.log(associations[key])

            for (var actionKey in actions) {
                const itemActionFnKey = actions[actionKey];

                if (actionKey === "create") {
                    app.post(`/api/${collectionName}/:id/${key}/${actionKey}`, async (req, res) => {
                        console.log(req.route.path);
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);
                            const item = await srcItem[itemActionFnKey](req.body);
                            res.status(201).json(item);
                        } catch (error) {
                            res.status(400).json({ error: error.message });
                        }
                    });
                }

                else if (actionKey === "set") {
                    app.patch(`/api/${collectionName}/:id/${key}/${actionKey}/:targetIds`, async (req, res) => {
                        console.log(req.route.path);
                        try {
                            if (isMultiple) {
                                const srcItem = await collectionModel.findByPk(req.params.id);
    
                                if (!srcItem) {
                                    res.status(404).json({ error: `${collectionName} ${req.params.id} not found` });
                                    return;
                                }

                                const targetItemIds = req.params.targetIds.split(",");
    
                                const response = await srcItem[itemActionFnKey](targetItemIds);
                                res.json(response);
    
                            } else {
                                const srcItem = await collectionModel.findByPk(req.params.id);
                                const targetItem = await targetModel.findByPk(req.params.targetIds);
    
                                if (!srcItem) {
                                    res.status(404).json({ error: `${collectionName} ${req.params.id} not found` });
                                    return;
                                }
    
                                if (!targetItem) {
                                    res.status(404).json({ error: `${key} ${req.params.targetIds} not found` });
                                    return;
                                }
    
                                const response = await srcItem[itemActionFnKey](targetItem);
                                res.json(response);
    
                            }
                        } catch (error) {
                            res.status(400).json({ error: error.message });
                        }
                    });
                }

                else if (actionKey === "add" || actionKey === "remove") {
                    app.patch(`/api/${collectionName}/:id/${key}/${actionKey}/:targetId`, async (req, res) => {
                        console.log(req.route.path);
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);
                            const targetItem = await targetModel.findByPk(req.params.targetId);

                            if (!srcItem) {
                                res.status(404).json({ error: `${collectionName} ${req.params.id} not found` });
                                return;
                            }

                            if (!targetItem) {
                                res.status(404).json({ error: `${key} ${req.params.targetId} not found` });
                                return;
                            }

                            const response = await srcItem[itemActionFnKey](targetItem);
                            res.json(response);
                        } catch (error) {
                            res.status(400).json({ error: error.message });
                        }
                    });
                }

                else if (actionKey === "addMultiple" || actionKey === "removeMultiple") {
                    app.patch(`/api/${collectionName}/:id/${key}/${actionKey}/:targetIds`, async (req, res) => {
                        console.log(req.route.path);
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);
    
                            if (!srcItem) {
                                res.status(404).json({ error: `${collectionName} ${req.params.id} not found` });
                                return;
                            }

                            const targetItemIds = req.params.targetIds.split(",");

                            const response = await srcItem[itemActionFnKey](targetItemIds);
                            res.json(response);
    
                        } catch (error) {
                            res.status(400).json({ error: error.message });
                        }
                    });
                }

                else if (actionKey === "count") {
                    app.get(`/api/${collectionName}/:id/${key}/countlist`, async (req, res) => {
                        console.log(req.route.path);
                        try {
                            const srcItem = await collectionModel.findByPk(req.params.id);

                            if (!srcItem) {
                                res.status(404).json({ error: `${collectionName} ${req.params.id} not found` });
                                return;
                            }


                            const { filter, sort, group, join, offset, limit  } = req.query; // Extract filter, sort, and join from query parameters
    
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
            


                            const targetItems = await srcItem[itemActionFnKey]({
                                ...whereClause ? {where: whereClause} : null,
                                ...orderClause ? {order: orderClause} : null,
                                ...groupClause !== undefined ? {group: groupClause} : null,
                                ...includeClause ? {include: includeClause} : null,
                                ...offsetClause !== undefined ? {offset: offsetClause} : null,
                                ...limitClause !== undefined ? {limit: limitClause} : null,                
                            });
                            res.json(targetItems);

                        } catch (error) {
                            res.status(400).json({ error: error.message });
                        }
                    });
                }

                else if (actionKey === "get") {

                    if (isMultiple) {
                        app.get(`/api/${collectionName}/:id/${key}/getlist`, async (req, res) => {
                            console.log(req.route.path);
                            try {
                                const srcItem = await collectionModel.findByPk(req.params.id);
    
                                if (!srcItem) {
                                    res.status(404).json({ error: `${collectionName} ${req.params.id} not found` });
                                    return;
                                }


                                const { filter, sort, group, join, offset, limit  } = req.query; // Extract filter, sort, and join from query parameters
        
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
                

    
                                const targetItems = await srcItem[itemActionFnKey]({
                                    ...whereClause ? {where: whereClause} : null,
                                    ...orderClause ? {order: orderClause} : null,
                                    ...groupClause !== undefined ? {group: groupClause} : null,
                                    ...includeClause ? {include: includeClause} : null,
                                    ...offsetClause !== undefined ? {offset: offsetClause} : null,
                                    ...limitClause !== undefined ? {limit: limitClause} : null,                
                                });
                                res.json(targetItems);
    
                            } catch (error) {
                                res.status(400).json({ error: error.message });
                            }
                        });
    
                    } else {
                        app.get(`/api/${collectionName}/:id/${key}/get`, async (req, res) => {
                            console.log(req.route.path);
                            try {
                                const srcItem = await collectionModel.findByPk(req.params.id);
    
                                if (!srcItem) {
                                    res.status(404).json({ error: `${collectionName} ${req.params.id} not found` });
                                    return;
                                }
    
                                const targetItem = await srcItem[itemActionFnKey]();
    
                                if (!targetItem) {
                                    res.status(404).json({ error: `${key} not found` });
                                    return;
                                }

                                res.json(targetItem);
    
                            } catch (error) {
                                res.status(400).json({ error: error.message });
                            }
                        });
    
                    }

                }
            }
        }
    }
}

