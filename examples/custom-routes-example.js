/**
 * Custom Routes Example
 * Demonstrates how to use CustomRoutes to add business logic endpoints
 */

import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import {
    modelRegistry,
    CustomRoutes,
    RouterWithMeta,
    RequestResponseMiddleware
} from 'sequelize-rest-framework';

// Setup Express app
const app = express();
app.use(express.json());

// Apply response middleware
app.use(RequestResponseMiddleware.apply());

// Setup OpenAPI metadata collection
const meta = {};
const router = express.Router();
const appWithMeta = RouterWithMeta({ router, meta });

// Setup Sequelize
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

// Define models
const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    category: { type: DataTypes.STRING }
});

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customerName: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('pending', 'fulfilled', 'cancelled'), defaultValue: 'pending' }
});

const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

// Setup associations
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

// Register models
modelRegistry.register('Product', Product);
modelRegistry.register('Order', Order);
modelRegistry.register('OrderItem', OrderItem);

// Define custom routes for Product model
const productRoutes = [
    // Get product statistics
    CustomRoutes.createRoute(
        'GET',
        '/api/products/stats',
        async ({ models }) => {
            const [count, totalValue] = await Promise.all([
                models.count(),
                models.sum('price')
            ]);
            return { count, totalValue: parseFloat(totalValue) || 0 };
        },
        {
            summary: 'Get product statistics',
            responses: {
                200: {
                    description: 'Product statistics',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    count: { type: 'number' },
                                    totalValue: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    ),

    // Bulk update products
    CustomRoutes.createRoute(
        'POST',
        '/api/products/bulk-update',
        async ({ models, req }) => {
            const { ids, updates } = req.body;
            if (!ids || !Array.isArray(ids) || !updates) {
                throw new Error('Invalid request: ids array and updates object required');
            }

            const [affectedCount] = await models.update(updates, {
                where: { id: ids }
            });

            return { affectedCount, updatedIds: ids };
        },
        {
            summary: 'Bulk update products',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                ids: {
                                    type: 'array',
                                    items: { type: 'integer' }
                                },
                                updates: { type: 'object' }
                            },
                            required: ['ids', 'updates']
                        }
                    }
                }
            }
        }
    ),

    // Clone a product
    CustomRoutes.createRoute(
        'POST',
        '/api/products/:id/clone',
        async ({ models, req }) => {
            const original = await models.findByPk(req.params.id);
            if (!original) {
                const error = new Error('Product not found');
                error.status = 404;
                throw error;
            }

            const clone = await models.create({
                ...original.toJSON(),
                id: undefined,
                name: `${original.name} (Copy)`
            });

            return clone;
        },
        {
            summary: 'Clone a product',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'Product ID to clone'
                }
            ]
        }
    )
];

// Register product custom routes
CustomRoutes.registerForModel('Product', appWithMeta, productRoutes);

// Define multi-model routes
const multiModelRoutes = [
    // Dashboard summary
    CustomRoutes.createRoute(
        'GET',
        '/api/dashboard/summary',
        async ({ models }) => {
            const [productCount, orderCount, pendingOrders] = await Promise.all([
                models.Product.count(),
                models.Order.count(),
                models.Order.count({ where: { status: 'pending' } })
            ]);

            return { productCount, orderCount, pendingOrders };
        },
        {
            summary: 'Get dashboard summary'
        }
    ),

    // Fulfill an order (cross-model operation)
    CustomRoutes.createRoute(
        'POST',
        '/api/orders/:id/fulfill',
        async ({ models, req }) => {
            const order = await models.Order.findByPk(req.params.id, {
                include: [{ model: models.OrderItem, as: 'orderItems' }]
            });

            if (!order) {
                const error = new Error('Order not found');
                error.status = 404;
                throw error;
            }

            if (order.status !== 'pending') {
                const error = new Error('Only pending orders can be fulfilled');
                error.status = 400;
                throw error;
            }

            // Update inventory for each product
            for (const item of order.orderItems) {
                const product = await models.Product.findByPk(item.productId);
                if (product.stock < item.quantity) {
                    const error = new Error(`Insufficient stock for product ${product.name}`);
                    error.status = 400;
                    throw error;
                }

                await product.decrement('stock', { by: item.quantity });
            }

            // Update order status
            await order.update({ status: 'fulfilled' });

            return await models.Order.findByPk(req.params.id, {
                include: [{ model: models.OrderItem, as: 'orderItems' }]
            });
        },
        {
            summary: 'Fulfill an order',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }
            ]
        }
    )
];

// Register multi-model routes
CustomRoutes.registerMultiModel(appWithMeta, multiModelRoutes);

// Define general routes (not tied to any model)
const generalRoutes = [
    // Health check endpoint
    CustomRoutes.createRoute(
        'GET',
        '/api/health',
        async ({ req, res }) => {
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: '1.0.0'
            };
        },
        {
            summary: 'API health check',
            responses: {
                200: {
                    description: 'Service is healthy',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string' },
                                    timestamp: { type: 'string' },
                                    uptime: { type: 'number' },
                                    version: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    ),

    // Custom analytics endpoint
    CustomRoutes.createRoute(
        'GET',
        '/api/analytics/summary',
        async ({ req, res }) => {
            // Custom analytics logic - could call external services
            const { period = 'daily' } = req.query;

            return {
                period,
                totalRevenue: 15420.50,
                totalOrders: 89,
                averageOrderValue: 173.26,
                topProducts: ['Product A', 'Product B', 'Product C'],
                generatedAt: new Date().toISOString()
            };
        },
        {
            summary: 'Get analytics summary',
            parameters: [
                {
                    name: 'period',
                    in: 'query',
                    schema: { type: 'string', enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
                    description: 'Time period for analytics'
                }
            ]
        }
    ),

    // Webhook endpoint example
    CustomRoutes.createRoute(
        'POST',
        '/api/webhooks/payment',
        async ({ req, res }) => {
            const { eventType, data } = req.body;

            // Process payment webhook
            console.log(`Received payment webhook: ${eventType}`);

            // Could validate webhook signature, process payment, etc.
            return {
                received: true,
                eventType,
                processed: true,
                timestamp: new Date().toISOString()
            };
        },
        {
            summary: 'Payment webhook handler',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                eventType: { type: 'string' },
                                data: { type: 'object' }
                            },
                            required: ['eventType']
                        }
                    }
                }
            }
        }
    ),

    // File upload endpoint example
    CustomRoutes.createRoute(
        'POST',
        '/api/upload/document',
        async ({ req, res }) => {
            // Simulate file upload processing
            const { filename, content } = req.body;

            if (!filename || !content) {
                throw new Error('Filename and content are required');
            }

            // In a real implementation, you would:
            // 1. Validate file type and size
            // 2. Upload to cloud storage (S3, etc.)
            // 3. Save metadata to database
            // 4. Return upload result

            return {
                success: true,
                filename,
                size: content.length,
                uploadedAt: new Date().toISOString(),
                url: `https://storage.example.com/${filename}`
            };
        },
        {
            summary: 'Upload document',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                filename: { type: 'string' },
                                content: { type: 'string' }
                            },
                            required: ['filename', 'content']
                        }
                    }
                }
            }
        }
    )
];

// Register general routes
CustomRoutes.registerGeneral(appWithMeta, generalRoutes);

// Initialize all routes (CRUD + custom)
async function initializeApp() {
    await sequelize.sync();

    // Mount the router with metadata
    app.use('/', router);

    // Initialize auto-CRUD routes
    await modelRegistry.initializeAll({ app, appWithMeta });

    console.log('✓ All routes initialized');
    console.log('Available custom routes:');
    console.log('- GET /api/products/stats');
    console.log('- POST /api/products/bulk-update');
    console.log('- POST /api/products/:id/clone');
    console.log('- GET /api/dashboard/summary');
    console.log('- POST /api/orders/:id/fulfill');
    console.log('- GET /api/health');
    console.log('- GET /api/analytics/summary');
    console.log('- POST /api/webhooks/payment');
    console.log('- POST /api/upload/document');

    // Display OpenAPI metadata
    console.log('\nOpenAPI metadata collected for', Object.keys(meta).length, 'routes');
}

export { app, initializeApp, sequelize, Product, Order, OrderItem };