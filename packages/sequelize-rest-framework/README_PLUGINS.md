# Plugin System - Sequelize REST Framework

## 🔌 Overview

The framework now includes a powerful plugin system that allows you to extend functionality without modifying core code. The flagship plugin is the **ACL (Access Control List) Plugin** which provides sophisticated role-based access control.

## ✨ Key Features

### 1. **Plugin Architecture**
- Hook-based system for lifecycle events
- Easy to create custom plugins
- No core code modification needed
- Composable and reusable

### 2. **ACL Plugin** ⭐
- **Role-Based Permissions** - Control access per model and action
- **Automatic JOIN Filtering** - Hide associated data based on permissions
- **Flexible Configuration** - Simple config-based setup
- **Custom Role Resolution** - Integrate with any auth system

## 🚀 Quick Start

### Basic ACL Setup

```javascript
import {
    pluginManager,
    ACLPlugin,
    createACLConfig,
    GenericCRUDWithPlugins,
} from 'sequelize-rest-framework';

// 1. Define permissions
const aclConfig = createACLConfig({
    Product: {
        create: ['admin'],
        read: ['admin', 'user', 'guest'],
        update: ['admin'],
        delete: ['admin'],
    },
    Order: {
        create: ['admin', 'user'],
        read: ['admin', 'user'],  // Guests cannot see orders
        update: ['admin'],
        delete: ['admin'],
    },
});

// 2. Create and register plugin
const aclPlugin = new ACLPlugin({
    config: aclConfig,
    getUserRole: (req) => req.user?.role || 'guest',
});

pluginManager.use(aclPlugin);

// 3. Use with routes
const productACL = ACLPlugin.applyToRoutes(app, 'Product', aclPlugin);

GenericCRUDWithPlugins.initialize({
    app,
    appWithMeta,
    collectionName: 'Product',
    collectionModel: models.Product,
    aclMiddleware: productACL,  // ← Apply ACL
});
```

## 🔐 ACL Use Cases

### Use Case 1: Basic Model Protection

```javascript
// Only admins can create, update, delete users
// Everyone can read (but see Use Case 3 for field filtering)
const config = createACLConfig({
    User: {
        create: ['admin'],
        read: ['admin', 'user', 'guest'],
        update: ['admin'],
        delete: ['admin'],
    },
});
```

**Result:**
- ✅ Admin can do everything
- ✅ Users/guests can read
- ❌ Users/guests cannot create/update/delete

### Use Case 2: JOIN Filtering by Role

```javascript
const config = createACLConfig({
    Product: {
        read: ['admin', 'user', 'guest'],  // Everyone can see products
    },
    Order: {
        read: ['admin', 'user'],  // Only admin and users can see orders
    },
    OrderItem: {
        read: ['admin'],  // Only admins can see order items
    },
});
```

**Scenario:** Guest requests `/api/Product?join={"include":[{"association":"orders","include":[{"association":"orderItems"}]}]}`

**Result:**
```javascript
// Guest gets:
{
    id: "1",
    name: "Product A",
    // orders: FILTERED OUT (no permission)
}

// User gets:
{
    id: "1",
    name: "Product A",
    orders: [{
        id: "1",
        total: 100,
        // orderItems: FILTERED OUT (no permission)
    }]
}

// Admin gets:
{
    id: "1",
    name: "Product A",
    orders: [{
        id: "1",
        total: 100,
        orderItems: [
            { id: "1", productId: "1", quantity: 2 }
        ]
    }]
}
```

### Use Case 3: Hiding Sensitive Data in JOINs

```javascript
const config = createACLConfig({
    User: {
        read: ['admin', 'user'],  // Users can see user data
    },
    UserCredential: {
        read: ['admin'],  // Only admins see credentials
    },
    UserPayment: {
        read: ['admin'],  // Only admins see payment methods
    },
});
```

**Scenario:** User requests `/api/Order?join={"include":[{"association":"user","include":[{"association":"credential"},{"association":"payments"}]}]}`

**Result for regular user:**
```javascript
{
    id: "order-1",
    userId: "user-1",
    user: {
        id: "user-1",
        name: "John",
        // credential: FILTERED OUT
        // payments: FILTERED OUT
    }
}
```

**Result for admin:**
```javascript
{
    id: "order-1",
    userId: "user-1",
    user: {
        id: "user-1",
        name: "John",
        credential: { /* included */ },
        payments: [ /* included */ ]
    }
}
```

### Use Case 4: Multi-Level JOIN Security

```javascript
const config = createACLConfig({
    Shop: { read: ['admin', 'manager', 'user', 'guest'] },
    Product: { read: ['admin', 'manager', 'user', 'guest'] },
    ProductVariant: { read: ['admin', 'manager', 'user', 'guest'] },
    ProductPricing: { read: ['admin', 'manager'] },  // Only admin/manager see pricing
});
```

**Complex Query:** `/api/Shop?join={"include":[{"association":"products","include":[{"association":"variants","include":[{"association":"pricing"}]}]}]}`

**For guest/user:**
- ✅ Shop
- ✅ Products
- ✅ Variants
- ❌ Pricing (filtered out)

**For admin/manager:**
- ✅ All levels included

## 📚 Advanced Topics

### Custom Role Resolution

```javascript
const aclPlugin = new ACLPlugin({
    config: aclConfig,

    // Custom function to determine user role
    getUserRole: (req) => {
        // From JWT token
        if (req.jwt?.role) return req.jwt.role;

        // From session
        if (req.session?.user?.role) return req.session.user.role;

        // From custom header
        if (req.headers['x-user-role']) return req.headers['x-user-role'];

        // Default
        return 'guest';
    },
});
```

### Custom Access Denied Handler

```javascript
const aclPlugin = new ACLPlugin({
    config: aclConfig,

    onAccessDenied: ({ req, res, model, action, role }) => {
        // Log the attempt
        logger.warn(`Access denied: ${role} → ${model}.${action}`, {
            userId: req.user?.id,
            ip: req.ip,
        });

        // Custom response
        res.status(403).json({
            error: 'Forbidden',
            message: `Insufficient permissions`,
            requiredAction: action,
            yourRole: role,
        });
    },
});
```

### Disable JOIN Filtering

```javascript
// If you want permissions but not automatic JOIN filtering
const aclPlugin = new ACLPlugin({
    config: aclConfig,
    enableJoinFiltering: false,  // Disable
});
```

## 🛠️ Creating Custom Plugins

### Example: Audit Log Plugin

```javascript
export class AuditLogPlugin {
    install(pluginManager) {
        pluginManager.registerHook('beforeCreate', async (context) => {
            await logAction({
                action: 'create',
                model: context.model,
                user: context.req.user?.id,
                data: context.data,
            });
            return context;
        });

        pluginManager.registerHook('beforeDelete', async (context) => {
            await logAction({
                action: 'delete',
                model: context.model,
                user: context.req.user?.id,
                id: context.id,
            });
            return context;
        });
    }
}

pluginManager.use(new AuditLogPlugin());
```

### Example: Data Ownership Plugin

```javascript
export class OwnershipPlugin {
    install(pluginManager) {
        // Users can only see their own data
        pluginManager.registerHook('modifyQuery', async (queryOptions, context) => {
            if (context.role === 'user' && context.req.user) {
                queryOptions.where = {
                    ...queryOptions.where,
                    userId: context.req.user.id,
                };
            }
            return queryOptions;
        });
    }
}
```

## 📖 Full Documentation

- **[PLUGIN_USAGE.md](./PLUGIN_USAGE.md)** - Complete plugin guide
- **[examples/acl-example.js](./examples/acl-example.js)** - Working ACL example
- **[README.md](./README.md)** - Main documentation

## 🔗 Integration with Existing Code

### Migrating from App-Specific ACL

**Old code:**
```javascript
import { _APIGenericMiddlewaresACL } from './_incl/index.js';
import { UserACLDao } from './dao/user/UserACLDao.js';
```

**New code:**
```javascript
import { ACLPlugin, pluginManager } from 'sequelize-rest-framework';

const aclConfig = createACLConfig({
    // ... your config from UserACLDao
});

const aclPlugin = new ACLPlugin({ config: aclConfig });
pluginManager.use(aclPlugin);
```

## 🧪 Testing

```javascript
// Test different roles
describe('ACL Plugin', () => {
    it('admin can create products', async () => {
        const req = { userRoleCode: 'admin' };
        const result = await aclPlugin.hasPermission('Product', 'create', 'admin');
        expect(result).toBe(true);
    });

    it('guest cannot create products', async () => {
        const req = { userRoleCode: 'guest' };
        const result = await aclPlugin.hasPermission('Product', 'create', 'guest');
        expect(result).toBe(false);
    });

    it('filters JOINs based on role', async () => {
        const includeClause = {
            include: [
                { association: 'orders' },  // read: ['admin', 'user']
            ]
        };

        const filtered = aclPlugin.filterJoinsByPermission(includeClause, 'guest');
        expect(filtered.include).toHaveLength(0);  // Filtered out
    });
});
```

## 💡 Best Practices

1. **Default Deny** - For sensitive models, don't list them in config (denied by default)
2. **Audit Trails** - Use plugins to log all permission checks
3. **Test All Roles** - Write tests for each role's access patterns
4. **Document Permissions** - Keep ACL config well-documented
5. **Review Regularly** - Audit permissions as features evolve

## 🆘 Troubleshooting

**JOINs not being filtered?**
- Ensure `enableJoinFiltering: true`
- Check associated models have `read` permissions configured
- Verify role is set in request: `req.aclRole`

**Access denied unexpectedly?**
- Check model name spelling (case-sensitive)
- Verify role is in the permission array/Set
- Check `getUserRole` returns correct value

**Plugin hooks not running?**
- Ensure using `GenericCRUDWithPlugins` not `GenericCRUD`
- Verify plugin registered: `pluginManager.use(plugin)`
- Check hook name spelling

## 📦 What's Included

- ✅ Plugin Manager with lifecycle hooks
- ✅ ACL Plugin with role-based access
- ✅ Automatic JOIN filtering
- ✅ GenericCRUDWithPlugins
- ✅ Complete examples
- ✅ TypeScript-ready structure
- ✅ Extensible architecture

---

**Ready to secure your API?** Start with the [ACL Example](./examples/acl-example.js) →
