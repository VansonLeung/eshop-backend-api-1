/**
 * Complete ACL Example
 *
 * This example demonstrates how to use the ACL plugin to control
 * access to models and filter JOINs based on user roles
 */

import express from 'express';
import { pluginManager, ACLPlugin, createACLConfig } from '../src/plugins/index.js';
import { GenericCRUDWithPlugins } from '../src/api/GenericCRUDWithPlugins.js';
import { RouterWithMeta } from '../src/api/index.js';
import { RequestResponseMiddleware } from '../src/api/index.js';

// === 1. Define ACL Configuration ===
const aclConfig = createACLConfig({
    // Product permissions
    Product: {
        create: ['admin', 'manager'],
        read: ['admin', 'manager', 'user', 'guest'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },

    // Order permissions
    Order: {
        create: ['admin', 'user'],  // Users can create their own orders
        read: ['admin', 'user'],     // Guests cannot see orders
        update: ['admin'],
        delete: ['admin'],
    },

    // OrderItem permissions (for JOINs)
    OrderItem: {
        read: ['admin', 'user'],     // Guests cannot see order items even in JOINs
    },

    // Shop permissions
    Shop: {
        create: ['admin'],
        read: ['admin', 'manager', 'user', 'guest'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },

    // User permissions
    User: {
        create: ['admin'],
        read: ['admin'],             // Only admins can list users
        update: ['admin'],
        delete: ['admin'],
    },

    // UserCredential permissions (sensitive data)
    UserCredential: {
        read: ['admin'],             // Only admins can see credentials in JOINs
    },

    // ProductVariant permissions
    ProductVariant: {
        read: ['admin', 'manager', 'user', 'guest'], // Everyone can see variants
    },
});

// === 2. Setup ACL Plugin ===
const aclPlugin = new ACLPlugin({
    config: aclConfig,

    // Get user role from request (customize based on your auth system)
    getUserRole: (req) => {
        // Priority: explicitly set role > user.role.code > default to guest
        return req.userRoleCode || req.user?.role?.code || 'guest';
    },

    // Custom access denied handler
    onAccessDenied: ({ req, res, model, action, role }) => {
        console.log(`Access denied: ${role} tried to ${action} on ${model}`);

        if (res) {
            return res.status(403).json({
                success: false,
                error: 'Access Denied',
                message: `Your role '${role}' does not have permission to '${action}' on '${model}'`,
                details: {
                    model,
                    action,
                    role,
                    path: req.path,
                }
            });
        }
    },

    // Enable JOIN filtering (default: true)
    enableJoinFiltering: true,
});

// === 3. Register Plugin ===
pluginManager.use(aclPlugin);

// === 4. Setup Express App ===
export function setupACLExample(app, models) {
    const router = express.Router();
    const meta = {};
    const routerWithMeta = RouterWithMeta({ router, meta });

    // Apply response middleware
    app.use(RequestResponseMiddleware.apply());

    // Middleware to simulate user authentication (replace with real auth)
    app.use((req, res, next) => {
        // Simulate getting user from session/token
        const authHeader = req.headers.authorization;

        if (authHeader === 'Bearer admin-token') {
            req.userRoleCode = 'admin';
            req.user = { id: 1, username: 'admin' };
        } else if (authHeader === 'Bearer user-token') {
            req.userRoleCode = 'user';
            req.user = { id: 2, username: 'john' };
        } else if (authHeader === 'Bearer manager-token') {
            req.userRoleCode = 'manager';
            req.user = { id: 3, username: 'manager' };
        } else {
            req.userRoleCode = 'guest';
            req.user = null;
        }

        next();
    });

    // === 5. Setup Routes with ACL ===

    // Product routes
    const productACL = ACLPlugin.applyToRoutes(app, 'Product', aclPlugin);
    GenericCRUDWithPlugins.initialize({
        app: router,
        appWithMeta: routerWithMeta,
        collectionName: 'Product',
        collectionModel: models.Product,
        aclMiddleware: productACL,
    });

    // Order routes
    const orderACL = ACLPlugin.applyToRoutes(app, 'Order', aclPlugin);
    GenericCRUDWithPlugins.initialize({
        app: router,
        appWithMeta: routerWithMeta,
        collectionName: 'Order',
        collectionModel: models.Order,
        aclMiddleware: orderACL,
    });

    // Shop routes
    const shopACL = ACLPlugin.applyToRoutes(app, 'Shop', aclPlugin);
    GenericCRUDWithPlugins.initialize({
        app: router,
        appWithMeta: routerWithMeta,
        collectionName: 'Shop',
        collectionModel: models.Shop,
        aclMiddleware: shopACL,
    });

    app.use(router);

    return app;
}

// === 6. Usage Examples ===

/*
Example 1: Guest tries to read products with orders (JOINs filtered)
-----------------------------------------------------------------
Request:
  GET /api/Product?join={"include":[{"association":"orders"}]}
  Headers: (no auth header = guest)

Result:
  - Products: ✅ Returned (guests can read products)
  - Orders JOIN: ❌ Filtered out (guests cannot read orders)

Response:
  {
    "status": 200,
    "data": [
      { "id": "1", "name": "Product 1" }  // No orders included
    ]
  }


Example 2: User reads products with orders
-----------------------------------------------------------------
Request:
  GET /api/Product?join={"include":[{"association":"orders"}]}
  Headers: Authorization: Bearer user-token

Result:
  - Products: ✅ Returned
  - Orders JOIN: ✅ Returned (users can read orders)

Response:
  {
    "status": 200,
    "data": [
      {
        "id": "1",
        "name": "Product 1",
        "orders": [{ "id": "1", "total": 100 }]  // Orders included
      }
    ]
  }


Example 3: User tries to create a product
-----------------------------------------------------------------
Request:
  POST /api/Product
  Headers: Authorization: Bearer user-token
  Body: { "name": "New Product" }

Result:
  ❌ Access Denied (only admin and manager can create products)

Response:
  {
    "success": false,
    "error": "Access Denied",
    "message": "Your role 'user' does not have permission to 'create' on 'Product'"
  }


Example 4: Admin creates a product
-----------------------------------------------------------------
Request:
  POST /api/Product
  Headers: Authorization: Bearer admin-token
  Body: { "name": "New Product" }

Result:
  ✅ Product created

Response:
  {
    "status": 201,
    "data": { "id": "2", "name": "New Product" }
  }


Example 5: Complex JOIN with multiple levels
-----------------------------------------------------------------
Request:
  GET /api/Order?join={"include":[{"association":"orderItems","include":[{"association":"product"}]}]}
  Headers: Authorization: Bearer user-token

ACL Rules:
  - Order.read: ['admin', 'user']
  - OrderItem.read: ['admin', 'user']
  - Product.read: ['admin', 'manager', 'user', 'guest']

Result for 'user':
  ✅ Order → ✅ OrderItems → ✅ Product (all included)

Result for 'guest':
  ❌ Access Denied for Order (cannot even start the request)


Example 6: Filtering sensitive associations
-----------------------------------------------------------------
Request:
  GET /api/User?join={"include":[{"association":"credential"}]}
  Headers: Authorization: Bearer admin-token

ACL Rules:
  - User.read: ['admin']
  - UserCredential.read: ['admin']

Result for 'admin':
  ✅ User → ✅ UserCredential (credentials included)

If a 'user' role somehow got to this endpoint:
  ✅ User → ❌ UserCredential (credentials filtered out)
*/

// === 7. Testing the ACL ===

/*
To test this example:

1. Start your server with this example
2. Test different scenarios:

   # Guest reads products (no orders)
   curl http://localhost:3000/api/Product?join=\{"include":\[{"association":"orders"}\]\}

   # User reads products (with orders)
   curl -H "Authorization: Bearer user-token" \
        http://localhost:3000/api/Product?join=\{"include":\[{"association":"orders"}\]\}

   # User tries to create product (denied)
   curl -X POST -H "Authorization: Bearer user-token" \
        -H "Content-Type: application/json" \
        -d '{"name":"New Product"}' \
        http://localhost:3000/api/Product

   # Admin creates product (success)
   curl -X POST -H "Authorization: Bearer admin-token" \
        -H "Content-Type: application/json" \
        -d '{"name":"New Product"}' \
        http://localhost:3000/api/Product
*/
