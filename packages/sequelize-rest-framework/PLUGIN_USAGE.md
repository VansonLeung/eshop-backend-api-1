
# Plugin System Usage Guide

## Overview

The Sequelize REST Framework now supports a powerful plugin system that allows you to extend functionality with custom behaviors, including Access Control Lists (ACL), logging, caching, and more.

## Plugin Architecture

### Core Concepts

1. **PluginManager** - Central manager for all plugins
2. **Hooks** - Lifecycle events that plugins can hook into
3. **Plugins** - Modular extensions that implement specific functionality

### Available Hooks

- `beforeRequest` - Before any request processing
- `afterRequest` - After request completes
- `beforeCreate` - Before creating a record
- `afterCreate` - After creating a record
- `beforeRead` - Before reading records
- `afterRead` - After reading records
- `beforeUpdate` - Before updating a record
- `afterUpdate` - After updating a record
- `beforeDelete` - Before deleting a record
- `afterDelete` - After deleting a record
- `onError` - When an error occurs
- `modifyQuery` - Modify Sequelize query options
- `modifyResponse` - Modify API response data
- `filterJoins` - Filter JOIN includes

## ACL Plugin

The ACL (Access Control List) plugin provides role-based access control for your API.

### Features

1. **Model-Action Permissions** - Control which roles can perform specific actions on models
2. **JOIN Filtering** - Automatically filter JOIN includes based on user permissions
3. **Custom Role Resolution** - Define how user roles are determined
4. **Flexible Configuration** - Configure permissions per model and action

### Basic Setup

```javascript
import {
    pluginManager,
    ACLPlugin,
    createACLConfig
} from 'sequelize-rest-framework/plugins';
import { GenericCRUDWithPlugins } from 'sequelize-rest-framework/api/GenericCRUDWithPlugins';

// 1. Define ACL configuration
const aclConfig = createACLConfig({
    Product: {
        create: ['admin', 'manager'],
        read: ['admin', 'manager', 'user', 'guest'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },
    Order: {
        create: ['admin', 'user'],
        read: ['admin', 'user'], // Guests cannot read orders
        update: ['admin'],
        delete: ['admin'],
    },
    OrderItem: {
        read: ['admin', 'user'], // Guests cannot see order items in JOINs
    },
    UserCredential: {
        read: ['admin'], // Only admins can see credentials in JOINs
    },
});

// 2. Create ACL plugin instance
const aclPlugin = new ACLPlugin({
    config: aclConfig,

    // Custom function to get user role from request
    getUserRole: (req) => {
        return req.userRoleCode || req.user?.role?.code || 'guest';
    },

    // Custom access denied handler
    onAccessDenied: ({ req, res, model, action, role }) => {
        res.status(403).json({
            error: 'Access Denied',
            message: `Role '${role}' cannot '${action}' on '${model}'`,
        });
    },

    // Enable/disable JOIN filtering (default: true)
    enableJoinFiltering: true,
});

// 3. Register plugin
pluginManager.use(aclPlugin);

// 4. Create middlewares for routes
const productACL = ACLPlugin.applyToRoutes(app, 'Product', aclPlugin);

// 5. Use with GenericCRUD
GenericCRUDWithPlugins.initialize({
    app,
    appWithMeta,
    collectionName: 'Product',
    collectionModel: models.Product,
    aclMiddleware: productACL, // Pass ACL middlewares
});
```

### Advanced: JOIN Filtering

The ACL plugin automatically filters JOINs based on user permissions:

**Scenario:** A guest user requests products with order information:

```javascript
// Request: GET /api/Product?join={"include":[{"association":"orders","include":[{"association":"orderItems"}]}]}

// ACL Config:
{
    Product: { read: ['admin', 'user', 'guest'] },
    Order: { read: ['admin', 'user'] },  // Guest CANNOT read
    OrderItem: { read: ['admin', 'user'] }  // Guest CANNOT read
}

// Result for 'guest' role:
// - Product data: ✅ Returned
// - Order data: ❌ Filtered out (no permission)
// - OrderItem data: ❌ Filtered out (no permission)

// Result for 'user' role:
// - Product data: ✅ Returned
// - Order data: ✅ Returned
// - OrderItem data: ✅ Returned
```

### Permission Levels

```javascript
const aclConfig = createACLConfig({
    Product: {
        create: ['admin'],           // Only admins can create
        read: ['admin', 'user'],     // Admins and users can read
        update: ['admin'],           // Only admins can update
        delete: ['admin'],           // Only admins can delete
    },

    // Fine-grained control for associations
    ProductVariant: {
        read: ['admin', 'user', 'guest'],  // Everyone can see variants
    },

    ProductPricing: {
        read: ['admin', 'manager'],  // Only admins and managers see pricing
    },
});
```

### Using Standalone Middleware

You can also use ACL as Express middleware:

```javascript
import { ACLPlugin } from 'sequelize-rest-framework/plugins';

const aclPlugin = new ACLPlugin({ config: aclConfig });

// Apply to specific routes
app.get('/api/Product',
    aclPlugin.createMiddleware('Product', 'read'),
    async (req, res) => {
        // Your handler
    }
);

app.post('/api/Product',
    aclPlugin.createMiddleware('Product', 'create'),
    async (req, res) => {
        // Your handler
    }
);
```

## Creating Custom Plugins

### Plugin Structure

```javascript
export class MyCustomPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    install(pluginManager) {
        // Register hooks
        pluginManager.registerHook('beforeCreate', async (context) => {
            console.log('Before create:', context.model);
            // Modify context if needed
            return context;
        });

        pluginManager.registerHook('modifyQuery', async (queryOptions, context) => {
            // Modify query
            if (context.role === 'user') {
                queryOptions.where = {
                    ...queryOptions.where,
                    userId: context.req.user.id, // Only show user's own data
                };
            }
            return queryOptions;
        });

        pluginManager.registerHook('modifyResponse', async (data, context) => {
            // Transform response
            if (context.role === 'guest') {
                // Remove sensitive fields
                if (Array.isArray(data)) {
                    return data.map(item => this.sanitize(item));
                }
                return this.sanitize(data);
            }
            return data;
        });
    }

    sanitize(item) {
        const { password, email, ...safe } = item.toJSON ? item.toJSON() : item;
        return safe;
    }
}

// Usage
import { pluginManager } from 'sequelize-rest-framework/plugins';
const myPlugin = new MyCustomPlugin({ /* options */ });
pluginManager.use(myPlugin);
```

### Example: Logging Plugin

```javascript
export class LoggingPlugin {
    install(pluginManager) {
        pluginManager.registerHook('beforeRequest', async (context) => {
            console.log(`[${context.action}] ${context.model}`, {
                user: context.req.user?.id,
                role: context.role,
            });
            return context;
        });

        pluginManager.registerHook('onError', async (context) => {
            console.error(`[ERROR] ${context.model}.${context.action}`, {
                error: context.error.message,
                user: context.req.user?.id,
            });
            return context;
        });
    }
}
```

### Example: Soft Delete Plugin

```javascript
export class SoftDeletePlugin {
    install(pluginManager) {
        pluginManager.registerHook('beforeDelete', async (context) => {
            // Instead of deleting, mark as deleted
            const model = context.req.app.get('models')[context.model];
            await model.update(
                { isDeleted: true, deletedAt: new Date() },
                { where: { id: context.id } }
            );
            context.cancel = true; // Cancel actual delete
            return context;
        });

        pluginManager.registerHook('modifyQuery', async (queryOptions, context) => {
            // Exclude soft-deleted records
            queryOptions.where = {
                ...queryOptions.where,
                isDeleted: false,
            };
            return queryOptions;
        });
    }
}
```

## Migration from Old ACL

If you're using the old app-specific ACL, here's how to migrate:

**Old (App-specific):**
```javascript
import { _APIGenericMiddlewaresACL } from './_incl/index.js';

appWithMeta.get('/api/Product',
    _APIGenericMiddlewaresACL.applyMiddlewareACL({
        models,
        apiName: 'Product',
        requiredPermission: 'read',
    }),
    handler
);
```

**New (Library plugin):**
```javascript
import { ACLPlugin, pluginManager } from 'sequelize-rest-framework/plugins';

const aclPlugin = new ACLPlugin({ config: aclConfig });
pluginManager.use(aclPlugin);

const productACL = ACLPlugin.applyToRoutes(app, 'Product', aclPlugin);

GenericCRUDWithPlugins.initialize({
    // ...
    aclMiddleware: productACL,
});
```

## Best Practices

1. **Centralized Config** - Keep ACL configuration in one place
2. **Default Deny** - For sensitive operations, default to denying access
3. **Test Permissions** - Write tests for each role's permissions
4. **Audit Logging** - Use plugins to log access attempts
5. **Role Hierarchy** - Consider implementing role inheritance
6. **JOIN Security** - Always configure read permissions for associated models

## Complete Example

See `/examples/acl-example.js` for a complete working example.

## Troubleshooting

### JOINs not being filtered
- Ensure `enableJoinFiltering: true` in ACL plugin options
- Check that associated models have read permissions configured
- Verify the role is correctly set in request context

### Access denied for valid role
- Check ACL configuration uses correct model names (case-sensitive)
- Verify `getUserRole` function returns expected role
- Confirm role is included in permission Set/Array

### Hooks not executing
- Ensure plugin is registered with `pluginManager.use(plugin)`
- Check hook name spelling (hooks are case-sensitive)
- Verify you're using `GenericCRUDWithPlugins` not `GenericCRUD`
