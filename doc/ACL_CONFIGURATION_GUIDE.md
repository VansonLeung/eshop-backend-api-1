# ACL Configuration Guide

**Purpose:** Guide for implementing access control in your application using middleware

---

## Quick Start

### 1. Define ACL Configuration

Create `/src/config/acl.js`:

```javascript
/**
 * ACL Configuration
 * Define which roles can perform which actions on each model
 */
export const aclConfig = {
    // Products - Public reading, restricted modifications
    Product: {
        create: ['admin', 'manager'],
        read: ['admin', 'user', 'guest'], // Everyone can read
        update: ['admin', 'manager'],
        delete: ['admin'],
    },

    // Product Variants - Same as Product
    ProductVariant: {
        create: ['admin', 'manager'],
        read: ['admin', 'user', 'guest'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },

    // Orders - Users can create their own, admins manage all
    Order: {
        create: ['admin', 'user'], // Users can create orders
        read: ['admin', 'user'],   // Users see own orders
        update: ['admin'],         // Only admins can modify
        delete: ['admin'],
    },

    // Order Items - Same as Order
    OrderItem: {
        create: ['admin', 'user'],
        read: ['admin', 'user'],
        update: ['admin'],
        delete: ['admin'],
    },

    // Shops - Admin and shop owners
    Shop: {
        create: ['admin'],
        read: ['admin', 'manager', 'user', 'guest'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },

    // Users - Admin only
    User: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin'],
    },

    // User Roles - Admin only
    UserRole: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin'],
    },

    // User Permissions - Admin only
    UserPermission: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin'],
    },

    // Payments - Restricted
    UserPayment: {
        create: ['admin', 'user'],
        read: ['admin', 'user'],
        update: ['admin'],
        delete: ['admin'],
    },

    // Shipping - Restricted
    UserShipping: {
        create: ['admin', 'user'],
        read: ['admin', 'user'],
        update: ['admin', 'user'],
        delete: ['admin'],
    },
};

/**
 * Get allowed roles for a model/action
 */
export const getAllowedRoles = (modelName, action) => {
    return aclConfig[modelName]?.[action] || [];
};

/**
 * Check if role can access model/action
 */
export const canAccess = (roleCode, modelName, action) => {
    const allowedRoles = getAllowedRoles(modelName, action);
    return allowedRoles.includes(roleCode);
};
```

### 2. Apply to Custom Routes

```javascript
import { CustomRoutes } from 'sequelize-rest-framework';
import { aclConfig } from '../../config/acl.js';

export const createProductRoutes = (models, authMiddleware) => {
    return [
        // Public endpoint - no auth required
        CustomRoutes.createRoute(
            'GET',
            '/api/products/featured',
            async ({ req, res }) => {
                // Anyone can access
                const products = await models.Product.findAll({
                    where: { isFeatured: true }
                });
                return { products };
            }
        ),

        // Authenticated endpoint - requires login
        CustomRoutes.createRoute(
            'GET',
            '/api/products/my-favorites',
            async ({ req, res }) => {
                // Middleware checks auth before this runs
                const favorites = await models.ProductFavorite.findAll({
                    where: { userId: req.user.id }
                });
                return { favorites };
            },
            {
                middleware: [
                    authMiddleware.authenticate()
                ]
            }
        ),

        // Role-based endpoint - requires specific role
        CustomRoutes.createRoute(
            'POST',
            '/api/products/bulk-import',
            async ({ req, res }) => {
                // Only admins and managers can bulk import
                // Import logic here
            },
            {
                middleware: [
                    authMiddleware.authenticate(),
                    authMiddleware.requireRole(['admin', 'manager'])
                ]
            }
        ),

        // ACL config endpoint - uses simple config
        CustomRoutes.createRoute(
            'DELETE',
            '/api/products/:id/permanent',
            async ({ req, res }) => {
                // Only admins can permanently delete
                await models.Product.destroy({
                    where: { id: req.params.id },
                    force: true
                });
                return { message: 'Permanently deleted' };
            },
            {
                middleware: [
                    authMiddleware.authenticate(),
                    authMiddleware.checkACL('Product', 'delete', aclConfig)
                ]
            }
        ),

        // Permission-based endpoint
        CustomRoutes.createRoute(
            'POST',
            '/api/products/:id/publish',
            async ({ req, res }) => {
                // Requires specific permission
                await models.Product.update(
                    { isPublished: true },
                    { where: { id: req.params.id }}
                );
                return { message: 'Published' };
            },
            {
                middleware: [
                    authMiddleware.authenticate(),
                    authMiddleware.requirePermission('Product', 'publish')
                ]
            }
        ),
    ];
};
```

### 3. Apply to Auto-Generated CRUD Routes

You can protect auto-generated CRUD routes by modifying the ModelRegistry initialization:

**Option A: In router.js (Apply to all models)**

```javascript
// In router.js
await modelRegistry.initializeAll({
    app: router,
    appWithMeta: routerWithMeta,
    // Global middleware for all models
    globalMiddleware: {
        create: [authMiddleware.authenticate()],
        update: [authMiddleware.authenticate()],
        delete: [authMiddleware.authenticate()],
        // read is public by default
    }
});
```

**Option B: Per-model in model registration**

```javascript
// When registering a model
modelRegistry.register('Product', models.Product, {
    middleware: {
        create: [
            authMiddleware.authenticate(),
            authMiddleware.checkACL('Product', 'create', aclConfig)
        ],
        update: [
            authMiddleware.authenticate(),
            authMiddleware.checkACL('Product', 'update', aclConfig)
        ],
        delete: [
            authMiddleware.authenticate(),
            authMiddleware.checkACL('Product', 'delete', aclConfig)
        ],
        // read can use optionalAuth to show different data for logged-in users
        read: [authMiddleware.optionalAuth()],
    }
});
```

---

## Advanced Patterns

### Pattern 1: Row-Level Security (User owns resource)

```javascript
// Middleware to check resource ownership
const requireOwnership = (modelName, idParam = 'id') => {
    return async (req, res, next) => {
        const resourceId = req.params[idParam];
        const resource = await models[modelName].findByPk(resourceId);
        
        if (!resource) {
            return res.status(404).json({
                success: false,
                error: 'Resource not found'
            });
        }
        
        // Check if user owns the resource
        if (resource.userId !== req.user.id && req.userRole.code !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'You can only modify your own resources'
            });
        }
        
        req.resource = resource;
        next();
    };
};

// Use in route
CustomRoutes.createRoute(
    'PUT',
    '/api/orders/:id',
    async ({ req, res }) => {
        // req.resource is already loaded and ownership verified
        await req.resource.update(req.body);
        return { order: req.resource };
    },
    {
        middleware: [
            authMiddleware.authenticate(),
            requireOwnership('Order')
        ]
    }
);
```

### Pattern 2: Conditional Access Based on Resource State

```javascript
// Middleware to check order status
const requireOrderStatus = (allowedStatuses) => {
    return async (req, res, next) => {
        const order = await models.Order.findByPk(req.params.id);
        
        if (!allowedStatuses.includes(order.status)) {
            return res.status(403).json({
                success: false,
                error: `Cannot modify order with status: ${order.status}`,
                allowedStatuses
            });
        }
        
        req.order = order;
        next();
    };
};

// Use in route
CustomRoutes.createRoute(
    'POST',
    '/api/orders/:id/cancel',
    async ({ req, res }) => {
        await req.order.update({ status: 'cancelled' });
        return { order: req.order };
    },
    {
        middleware: [
            authMiddleware.authenticate(),
            requireOwnership('Order'),
            requireOrderStatus(['pending', 'processing']) // Can't cancel completed orders
        ]
    }
);
```

### Pattern 3: Time-Based Access

```javascript
// Middleware for business hours
const requireBusinessHours = () => {
    return (req, res, next) => {
        const hour = new Date().getHours();
        const isBusinessHours = hour >= 9 && hour < 17; // 9 AM to 5 PM
        
        if (!isBusinessHours && req.userRole.code !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'This operation is only available during business hours (9 AM - 5 PM)',
                message: 'Admins can access anytime'
            });
        }
        
        next();
    };
};
```

### Pattern 4: Rate Limiting by Role

```javascript
// Simple rate limiter
const rateLimitByRole = (limits) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const roleCode = req.userRole?.code || 'guest';
        const key = `${req.ip}:${roleCode}`;
        const limit = limits[roleCode] || limits.default;
        
        const now = Date.now();
        const windowStart = now - 60000; // 1 minute window
        
        // Get requests in current window
        const userRequests = requests.get(key) || [];
        const recentRequests = userRequests.filter(time => time > windowStart);
        
        if (recentRequests.length >= limit) {
            return res.status(429).json({
                success: false,
                error: 'Rate limit exceeded',
                limit,
                retryAfter: 60
            });
        }
        
        // Add current request
        recentRequests.push(now);
        requests.set(key, recentRequests);
        
        next();
    };
};

// Usage
const rateLimits = {
    admin: 1000,
    user: 100,
    guest: 10,
    default: 10
};

app.use('/api', rateLimitByRole(rateLimits));
```

### Pattern 5: Field-Level Permissions

```javascript
// Middleware to filter response fields by role
const filterFields = (allowedFieldsByRole) => {
    return (req, res, next) => {
        const roleCode = req.userRole?.code || 'guest';
        const allowedFields = allowedFieldsByRole[roleCode] || [];
        
        // Wrap res.json to filter fields
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            if (data && typeof data === 'object') {
                const filtered = filterObjectFields(data, allowedFields);
                return originalJson(filtered);
            }
            return originalJson(data);
        };
        
        next();
    };
};

function filterObjectFields(obj, allowedFields) {
    if (Array.isArray(obj)) {
        return obj.map(item => filterObjectFields(item, allowedFields));
    }
    
    const filtered = {};
    for (const field of allowedFields) {
        if (obj.hasOwnProperty(field)) {
            filtered[field] = obj[field];
        }
    }
    return filtered;
}

// Usage
const userFieldPermissions = {
    admin: ['id', 'username', 'email', 'password', 'roleId', 'createdAt'],
    user: ['id', 'username', 'email', 'createdAt'],
    guest: ['id', 'username']
};

app.get('/api/users/:id',
    authMiddleware.optionalAuth(),
    filterFields(userFieldPermissions),
    async (req, res) => {
        const user = await models.User.findByPk(req.params.id);
        res.json(user);
    }
);
```

---

## Testing ACL

### Test Script Example

Create `/tests/acl.test.js`:

```javascript
import { AuthService } from '../src/services/auth.js';
import { ACLService } from '../src/services/acl.js';

describe('ACL Tests', () => {
    let adminUser, regularUser, guestUser;
    let adminToken, userToken;

    beforeAll(async () => {
        // Create test users
        adminUser = await authService.register({
            username: 'admin_test',
            email: 'admin@test.com',
            password: 'password123',
            roleId: adminRoleId
        });

        regularUser = await authService.register({
            username: 'user_test',
            email: 'user@test.com',
            password: 'password123',
            roleId: userRoleId
        });

        // Login
        const adminLogin = await authService.login({
            username: 'admin_test',
            password: 'password123'
        });
        adminToken = adminLogin.accessToken;

        const userLogin = await authService.login({
            username: 'user_test',
            password: 'password123'
        });
        userToken = userLogin.accessToken;
    });

    test('Admin can delete products', async () => {
        const response = await fetch('http://localhost:3000/api/Product/123', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        expect(response.status).toBe(200);
    });

    test('User cannot delete products', async () => {
        const response = await fetch('http://localhost:3000/api/Product/123', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        
        expect(response.status).toBe(403);
    });

    test('Guest can read products', async () => {
        const response = await fetch('http://localhost:3000/api/Product');
        expect(response.status).toBe(200);
    });

    test('Guest cannot create products', async () => {
        const response = await fetch('http://localhost:3000/api/Product', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test Product' })
        });
        
        expect(response.status).toBe(401); // No token
    });
});
```

---

## Summary

✅ Simple role-based ACL configuration  
✅ Multiple middleware patterns for different use cases  
✅ Row-level security support  
✅ Field-level permission filtering  
✅ Time-based and rate-limiting controls  
✅ Easy to test and maintain  

This gives you complete flexibility to implement any access control pattern you need!
