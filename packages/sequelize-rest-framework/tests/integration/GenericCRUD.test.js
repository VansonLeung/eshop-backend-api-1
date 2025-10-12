import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import { APIGenericCRUD } from '../../src/api/GenericCRUD.js';

// Mock response methods
const mockResponse = () => {
    const res = {};
    res.sendResponse = function(data) {
        this.responseData = data;
        return this;
    };
    res.sendError = function(data) {
        this.errorData = data;
        return this;
    };
    return res;
};

// Mock request
const mockRequest = (params = {}, query = {}, body = {}) => ({
    params,
    query,
    body
});

describe('APIGenericCRUD Integration Tests', () => {
    let sequelize;
    let TestModel;
    let app;
    let routeHandlers;

    beforeAll(async () => {
        // Create in-memory SQLite database for testing
        sequelize = new Sequelize('sqlite::memory:', {
            logging: false
        });

        // Define a test model
        TestModel = sequelize.define('TestModel', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            value: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        });

        // Sync the model
        await sequelize.sync();

        // Create Express app
        app = express();
        app.use(express.json());

        // Create a map to store route handlers
        routeHandlers = {};

        // Mock appWithMeta that stores handlers
        const appWithMeta = {
            get: (path, schema, handler) => {
                routeHandlers[`GET ${path}`] = handler;
            },
            post: (path, schema, handler) => {
                routeHandlers[`POST ${path}`] = handler;
            },
            put: (path, schema, handler) => {
                routeHandlers[`PUT ${path}`] = handler;
            },
            delete: (path, schema, handler) => {
                routeHandlers[`DELETE ${path}`] = handler;
            }
        };

        // Initialize the CRUD API
        APIGenericCRUD.initialize({
            app,
            appWithMeta,
            collectionName: 'testmodels',
            collectionModel: TestModel
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/testmodels', () => {
        it('should return empty array when no items exist', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await routeHandlers['GET /api/testmodels'](req, res);

            expect(res.responseData.status).toBe(200);
            expect(res.responseData.data).toEqual([]);
        });

        it('should return items with filtering', async () => {
            // Create test data
            await TestModel.create({ name: 'Test1', value: 10 });
            await TestModel.create({ name: 'Test2', value: 20 });

            const req = mockRequest({}, { filter: { name: 'Test1' } });
            const res = mockResponse();

            await routeHandlers['GET /api/testmodels'](req, res);

            expect(res.responseData.status).toBe(200);
            expect(res.responseData.data).toHaveLength(1);
            expect(res.responseData.data[0].name).toBe('Test1');
        });
    });

    describe('GET /api/testmodels/:id', () => {
        it('should return item by ID', async () => {
            const item = await TestModel.create({ name: 'TestById', value: 30 });

            const req = mockRequest({ id: item.id });
            const res = mockResponse();

            await routeHandlers['GET /api/testmodels/:id'](req, res);

            expect(res.responseData.status).toBe(200);
            expect(res.responseData.data.name).toBe('TestById');
            expect(res.responseData.data.value).toBe(30);
        });

        it('should return 404 for non-existent ID', async () => {
            const req = mockRequest({ id: 999 });
            const res = mockResponse();

            await routeHandlers['GET /api/testmodels/:id'](req, res);

            expect(res.errorData.status).toBe(404);
            expect(res.errorData.error.message).toBe('testmodels not found');
        });
    });

    describe('POST /api/testmodels', () => {
        it('should create new item', async () => {
            const req = mockRequest({}, {}, { name: 'NewItem', value: 40 });
            const res = mockResponse();

            await routeHandlers['POST /api/testmodels'](req, res);

            expect(res.responseData.status).toBe(201);
            expect(res.responseData.data.name).toBe('NewItem');
            expect(res.responseData.data.value).toBe(40);
            expect(res.responseData.data.id).toBeDefined();
        });
    });

    describe('PUT /api/testmodels/:id', () => {
        it('should update existing item', async () => {
            const item = await TestModel.create({ name: 'UpdateMe', value: 50 });

            const req = mockRequest({ id: item.id }, {}, { name: 'Updated', value: 60 });
            const res = mockResponse();

            await routeHandlers['PUT /api/testmodels/:id'](req, res);

            expect(res.responseData.status).toBe(200);
            expect(res.responseData.data.name).toBe('Updated');
            expect(res.responseData.data.value).toBe(60);
        });

        it('should return 404 for non-existent ID', async () => {
            const req = mockRequest({ id: 999 }, {}, { name: 'ShouldFail' });
            const res = mockResponse();

            await routeHandlers['PUT /api/testmodels/:id'](req, res);

            expect(res.errorData.status).toBe(404);
            expect(res.errorData.error.message).toBe('testmodels not found');
        });
    });

    describe('DELETE /api/testmodels/:id', () => {
        it('should delete existing item', async () => {
            const item = await TestModel.create({ name: 'DeleteMe', value: 70 });

            const req = mockRequest({ id: item.id });
            const res = mockResponse();

            await routeHandlers['DELETE /api/testmodels/:id'](req, res);

            expect(res.responseData.status).toBe(204);

            // Verify item is deleted
            const deletedItem = await TestModel.findByPk(item.id);
            expect(deletedItem).toBeNull();
        });

        it('should return 404 for non-existent ID', async () => {
            const req = mockRequest({ id: 999 });
            const res = mockResponse();

            await routeHandlers['DELETE /api/testmodels/:id'](req, res);

            expect(res.errorData.status).toBe(404);
            expect(res.errorData.error.message).toBe('testmodels not found');
        });
    });

    describe('POST /api/testmodels/bulk', () => {
        it('should bulk upsert items', async () => {
            const bulkData = [
                { name: 'Bulk1', value: 80 },
                { name: 'Bulk2', value: 90 }
            ];

            const req = mockRequest({}, {}, bulkData);
            const res = mockResponse();

            await routeHandlers['POST /api/testmodels/bulk'](req, res);

            expect(res.responseData.status).toBe(201);
            expect(res.responseData.data).toBe(true);

            // Verify items were created
            const items = await TestModel.findAll({ where: { name: ['Bulk1', 'Bulk2'] } });
            expect(items).toHaveLength(2);
        });
    });

    describe('DELETE /api/testmodels/:ids/bulk', () => {
        it('should bulk delete items', async () => {
            const item1 = await TestModel.create({ name: 'BulkDelete1', value: 100 });
            const item2 = await TestModel.create({ name: 'BulkDelete2', value: 110 });

            const req = mockRequest({ ids: [item1.id, item2.id] });
            const res = mockResponse();

            await routeHandlers['DELETE /api/testmodels/:ids/bulk'](req, res);

            expect(res.responseData.status).toBe(204);

            // Verify items are deleted
            const deletedItem1 = await TestModel.findByPk(item1.id);
            const deletedItem2 = await TestModel.findByPk(item2.id);
            expect(deletedItem1).toBeNull();
            expect(deletedItem2).toBeNull();
        });

        it('should return 400 for empty IDs array', async () => {
            const req = mockRequest({ ids: [] });
            const res = mockResponse();

            await routeHandlers['DELETE /api/testmodels/:ids/bulk'](req, res);

            expect(res.responseData.status).toBe(400);
            expect(res.responseData.error.message).toBe('No IDs provided');
        });
    });
});