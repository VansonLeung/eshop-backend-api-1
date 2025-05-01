import { _APIGenericAssociations } from "./_APIGenericAssociationsCRUD.js";
import { Op } from 'sequelize';

export const _APIGenericCRUD = {
    initialize: ({
        app,
        collectionName,
        collectionModel,
    }) => {
                
        // Create a Item
        app.post(`/api/${collectionName}`, async (req, res) => {
            try {
                const item = await collectionModel.create(req.body);
                res.status(201).json(item);
            } catch (error) {
                res.status(400).json({ error: error.message });
                throw error;
            }
        });

        // Read all Items
        app.get(`/api/${collectionName}`, async (req, res) => {
            try {
                const { filter, sort, group, join, offset, limit, isCount = false,  } = req.query; // Extract filter, sort, and join from query parameters
        
                // Build the where clause for filtering
                const whereClause = filter ? JSON.parse(filter) : undefined; // Assuming filter is a JSON string

                const recursiveMassageWhereClause = (whereClause) => {
                    const keys = Object.keys(whereClause);
                    for (var k in keys) {
                        if (keys[k] === "$like") { 
                            whereClause[Op.like] = whereClause.$like; 
                            delete whereClause.$like;
                        }
                    }
                    for (var k in whereClause) {
                        const val = whereClause[k];
                        if (val && typeof(val) === 'object') {
                            recursiveMassageWhereClause(val);
                        }
                    }
                }

                recursiveMassageWhereClause(whereClause);

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
                        ...offsetClause !== undefined ? {offset: offsetClause} : null,
                        ...limitClause !== undefined ? {limit: limitClause} : null,
                    });
                    res.json(count);
                    return;    
                }

                const items = await collectionModel.findAll({
                    ...whereClause ? {where: whereClause} : null,
                    ...orderClause ? {order: orderClause} : null,
                    ...groupClause !== undefined ? {group: groupClause} : null,
                    ...includeClause ? {include: includeClause} : null,
                    ...offsetClause !== undefined ? {offset: offsetClause} : null,
                    ...limitClause !== undefined ? {limit: limitClause} : null,
                });
                res.json(items);
            } catch (error) {
                res.status(500).json({ error: error.message });
                throw error;
            }
        });

        // Read a Item by ID
        app.get(`/api/${collectionName}/:id`, async (req, res) => {
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
        app.put(`/api/${collectionName}/:id`, async (req, res) => {
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
        app.delete(`/api/${collectionName}/:id`, async (req, res) => {
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
            collectionName,
            collectionModel,
        });
    }
}

