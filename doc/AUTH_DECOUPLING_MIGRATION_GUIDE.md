# Migration Guide: Decoupling Auth from sequelize-rest-framework

**Date:** October 15, 2025  
**Purpose:** Move authentication and authorization from the library to application layer for maximum flexibility

---

## Overview

This guide documents the migration from using the built-in `AuthSystem` in `sequelize-rest-framework` to implementing authentication and authorization as custom routes and middleware in the application layer.

### Why This Migration?

**Benefits:**
- ✅ **Maximum Flexibility**: Full control over auth logic, validation, and business rules
- ✅ **No Library Lock-in**: Auth is not tied to framework internals
- ✅ **Custom Business Logic**: Easy to add custom validation, hooks, and events
- ✅ **Better Testing**: Auth logic can be tested independently
- ✅ **Framework Simplicity**: Library focuses only on generic CRUD operations

---

## What Was Created

### 1. Services (`/src/services/`)

#### **auth.js** - Authentication Service
Handles user authentication operations:
- `register()` - User registration with password hashing
- `login()` - Login with token generation (access + refresh tokens)
- `logout()` - Session invalidation
- `logoutAll()` - Invalidate all user sessions
- `verifyToken()` - Token validation
- `refreshToken()` - Token renewal
- `getCurrentUser()` - Get user by token
- `changePassword()` - Password change

**Key Features:**
- Bcrypt password hashing (configurable rounds)
- Crypto-based token generation (32-byte hex)
- 24-hour token expiry (configurable)
- IP address and user agent tracking
- Support for local and OAuth providers

#### **acl.js** - Access Control Service
Handles authorization and permission checking:
- `hasPermission()` - Check user permission for resource/action
- `hasRole()` - Check if user has specific role(s)
- `roleHasPermission()` - Check role permission (with caching)
- `getUserPermissions()` - Get all user permissions
- `getRolePermissions()` - Get all role permissions
- `assignPermissionToRole()` - Add permission to role
- `removePermissionFromRole()` - Remove permission from role
- `createPermission()` - Create new permission
- `createRole()` - Create new role
- `assignRoleToUser()` - Assign role to user
- `hasMinimumLevel()` - Check minimum role level
- `canAccess()` - Check access using ACL config
- Cache management functions

**Key Features:**
- Permission caching for performance
- Role-based access control (RBAC)
- Fine-grained resource/action permissions
- Level-based authorization
- Simple ACL config support

### 2. Middleware (`/src/middleware/`)

#### **auth.js** - Authentication Middleware
Provides Express middleware functions:

1. **`authenticate()`** - Require valid access token
   - Extracts token from Authorization header
   - Verifies token and attaches user to `req.user`
   - Attaches role to `req.userRole`
   - Returns 401 if invalid/missing

2. **`requireRole(allowedRoles)`** - Require specific role(s)
   - Checks if user has one of allowed roles
   - Returns 403 if insufficient permissions

3. **`requirePermission(resource, action)`** - Require specific permission
   - Checks if user has permission for resource/action
   - Returns 403 if insufficient permissions

4. **`requireLevel(minimumLevel)`** - Require minimum role level
   - Checks if user's role level >= minimum
   - Returns 403 if insufficient level

5. **`optionalAuth()`** - Optional authentication
   - Attaches user if token provided
   - Doesn't fail if no token

6. **`checkACL(modelName, action, aclConfig)`** - Simple ACL check
   - Uses simple config object for role-based access
   - Flexible for quick permission checks

### 3. Custom Routes (`/src/apis/custom-routes/`)

#### **auth.js** - Authentication Endpoints
Six authentication endpoints:

1. **`POST /api/auth/register`** - Register new user
2. **`POST /api/auth/login`** - Login and get tokens
3. **`POST /api/auth/logout`** - Logout current session
4. **`POST /api/auth/refresh`** - Refresh access token
5. **`GET /api/auth/me`** - Get current user info
6. **`POST /api/auth/logout-all`** - Logout all sessions

**Features:**
- Full OpenAPI/Swagger documentation
- Consistent response format
- Error handling with meaningful messages
- Security headers support

---

## Architecture

```
Application Layer (Your Full Control)
├── Custom Auth Routes (/src/apis/custom-routes/auth.js)
│   └── 6 authentication endpoints
│
├── Auth Middleware (/src/middleware/auth.js)
│   └── 6 middleware functions for route protection
│
├── Auth Services (/src/services/)
│   ├── auth.js - Authentication logic
│   └── acl.js - Authorization logic
│
└── User Models (Already exist in /src/models/stores/)
    ├── EBUser
    ├── EBUserRole
    ├── EBUserPermission
    ├── EBUserSession
    ├── EBUserCredential
    └── EBUserRolePermissionMapping

Library Layer (Generic CRUD Only)
└── sequelize-rest-framework
    ├── GenericCRUD (No auth dependencies)
    ├── ModelRegistry
    ├── CustomRoutes
    └── RouterWithMeta
```

---

## Usage Examples

### Example 1: Basic Authentication

```javascript
import { createAuthMiddleware } from './src/middleware/auth.js';

const authMiddleware = createAuthMiddleware(models);

// Protect a route
app.get('/api/protected', 
    authMiddleware.authenticate(), 
    (req, res) => {
        res.json({ user: req.user });
    }
);
```

### Example 2: Role-Based Access

```javascript
// Only admins can delete products
app.delete('/api/Product/:id',
    authMiddleware.authenticate(),
    authMiddleware.requireRole(['admin']),
    async (req, res) => {
        // Delete logic
    }
);

// Admins and managers can create products
app.post('/api/Product',
    authMiddleware.authenticate(),
    authMiddleware.requireRole(['admin', 'manager']),
    async (req, res) => {
        // Create logic
    }
);
```

### Example 3: Permission-Based Access

```javascript
// Require specific permission
app.delete('/api/Product/:id',
    authMiddleware.authenticate(),
    authMiddleware.requirePermission('Product', 'delete'),
    async (req, res) => {
        // Delete logic
    }
);
```

### Example 4: Level-Based Access

```javascript
// Require minimum role level (e.g., level 50 = manager)
app.get('/api/reports',
    authMiddleware.authenticate(),
    authMiddleware.requireLevel(50),
    async (req, res) => {
        // Reports logic
    }
);
```

### Example 5: Simple ACL Config

```javascript
// Define ACL configuration
const aclConfig = {
    Product: {
        create: ['admin', 'manager'],
        read: ['admin', 'user', 'guest'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },
    Order: {
        create: ['admin', 'user'],
        read: ['admin', 'user'],
        update: ['admin'],
        delete: ['admin'],
    },
};

// Use in routes
app.post('/api/Product',
    authMiddleware.optionalAuth(), // Get user if available
    authMiddleware.checkACL('Product', 'create', aclConfig),
    async (req, res) => {
        // Create logic
    }
);
```

### Example 6: Optional Authentication

```javascript
// Public route that shows different data for logged-in users
app.get('/api/Product',
    authMiddleware.optionalAuth(), // Don't fail if no token
    async (req, res) => {
        const includePrivate = req.user ? true : false;
        // Fetch products with or without private fields
    }
);
```

### Example 7: Programmatic Service Usage

```javascript
import { AuthService } from './src/services/auth.js';
import { ACLService } from './src/services/acl.js';

const authService = new AuthService(models);
const aclService = new ACLService(models);

// Register user programmatically
const user = await authService.register({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securePassword123'
});

// Check permissions programmatically
const canDelete = await aclService.hasPermission(
    userId, 
    'Product', 
    'delete'
);

// Check role programmatically
const isAdmin = await aclService.hasRole(userId, ['admin']);
```

---

## Migration Steps

### Step 1: Update index.js

**Before:**
```javascript
import { AuthSystem } from 'sequelize-rest-framework';

const authSystem = new AuthSystem(sequelize, {
    modelPrefix: 'EB',
    tablePrefix: 'eb_',
    tokenExpiry: 24 * 60 * 60 * 1000,
});
authSystem.initialize({
    User: models.User,
    UserRole: models.UserRole,
    // ... other models
});

const app = await initializeAPIs({ models, authSystem });
```

**After:**
```javascript
// Remove AuthSystem import
// Auth is now handled in custom routes

const app = await initializeAPIs({ models }); // Remove authSystem param
```

### Step 2: Use Auth Middleware in Routes

The auth middleware is automatically exposed on the app:

```javascript
// Access middleware anywhere
const { authenticate, requireRole, requirePermission } = app.authMiddleware;

// Apply to routes
app.delete('/api/Product/:id',
    authenticate(),
    requireRole(['admin']),
    handler
);
```

### Step 3: Use New Auth Endpoints

**Old endpoints (deprecated):**
- `/api/auth-legacy/*` (if library auth still enabled)

**New endpoints (recommended):**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout-all`

### Step 4: Protect Auto-Generated CRUD Routes

You can protect auto-generated routes using the ModelRegistry options:

```javascript
// In your model registration
modelRegistry.register('Product', models.Product, {
    // Add middleware to specific operations
    middleware: {
        create: [
            app.authMiddleware.authenticate(),
            app.authMiddleware.requireRole(['admin', 'manager'])
        ],
        update: [
            app.authMiddleware.authenticate(),
            app.authMiddleware.requireRole(['admin'])
        ],
        delete: [
            app.authMiddleware.authenticate(),
            app.authMiddleware.requireRole(['admin'])
        ],
        // read operations can remain public or use optionalAuth
    }
});
```

---

## ACL Configuration Patterns

### Pattern 1: Role-Based Config

```javascript
export const aclConfig = {
    // Public resources
    Product: {
        create: ['admin', 'manager'],
        read: ['admin', 'user', 'guest'], // Everyone can read
        update: ['admin', 'manager'],
        delete: ['admin'],
    },
    
    // User-specific resources
    Order: {
        create: ['admin', 'user'], // Users can create their own orders
        read: ['admin', 'user'],   // Users can read their own orders
        update: ['admin'],         // Only admins can update
        delete: ['admin'],
    },
    
    // Admin-only resources
    User: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin'],
    },
};
```

### Pattern 2: Resource-Level Permissions

```javascript
// Create permissions in database
await aclService.createPermission({
    resource: 'Product',
    action: 'create',
    description: 'Create new products'
});

await aclService.createPermission({
    resource: 'Product',
    action: 'delete',
    description: 'Delete products'
});

// Assign to roles
const adminRole = await models.UserRole.findOne({ where: { code: 'admin' }});
const permission = await models.UserPermission.findOne({
    where: { resource: 'Product', action: 'delete' }
});

await aclService.assignPermissionToRole(adminRole.id, permission.id);

// Use in routes
app.delete('/api/Product/:id',
    authMiddleware.authenticate(),
    authMiddleware.requirePermission('Product', 'delete'),
    handler
);
```

### Pattern 3: Level-Based Access

```javascript
// Define role levels in database
// admin: level 100
// manager: level 50
// user: level 10
// guest: level 0

// Protect routes by level
app.get('/api/admin/dashboard',
    authMiddleware.authenticate(),
    authMiddleware.requireLevel(100), // Only admin
    handler
);

app.get('/api/manager/reports',
    authMiddleware.authenticate(),
    authMiddleware.requireLevel(50), // Manager and above
    handler
);
```

---

## Testing

### Test Authentication

```javascript
// Test register
const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    })
});

// Test login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
    })
});

const { accessToken } = await loginResponse.json();

// Test protected route
const protectedResponse = await fetch('http://localhost:3000/api/protected', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
});
```

### Test Authorization

```bash
# Test without token (should fail with 401)
curl http://localhost:3000/api/protected

# Test with token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/protected

# Test insufficient permissions (should fail with 403)
curl -X DELETE -H "Authorization: Bearer USER_TOKEN" http://localhost:3000/api/Product/123
```

---

## Next Steps

### 1. Seed Default Roles and Permissions

Create a seed script (`/src/seeds/auth-seed.js`):

```javascript
export const seedAuth = async (models) => {
    // Create roles
    const adminRole = await models.UserRole.create({
        code: 'admin',
        name: 'Administrator',
        level: 100,
        description: 'Full system access'
    });

    const userRole = await models.UserRole.create({
        code: 'user',
        name: 'User',
        level: 10,
        description: 'Standard user access'
    });

    const guestRole = await models.UserRole.create({
        code: 'guest',
        name: 'Guest',
        level: 0,
        description: 'Limited guest access'
    });

    // Create permissions
    const permissions = [
        { resource: 'Product', action: 'create' },
        { resource: 'Product', action: 'read' },
        { resource: 'Product', action: 'update' },
        { resource: 'Product', action: 'delete' },
        { resource: 'Order', action: 'create' },
        { resource: 'Order', action: 'read' },
        { resource: 'Order', action: 'update' },
        { resource: 'Order', action: 'delete' },
    ];

    for (const perm of permissions) {
        const permission = await models.UserPermission.create(perm);
        
        // Assign all permissions to admin
        await models.UserRolePermissionMapping.create({
            roleId: adminRole.id,
            permissionId: permission.id
        });
        
        // Assign read permissions to user
        if (perm.action === 'read') {
            await models.UserRolePermissionMapping.create({
                roleId: userRole.id,
                permissionId: permission.id
            });
        }
    }

    console.log('✅ Auth seed completed');
};
```

### 2. Add Custom Validation

Extend the services with custom business logic:

```javascript
// In auth.js
async register({ username, email, password, roleId }) {
    // Custom validation
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }
    
    // Check if username exists
    const existing = await this.models.User.findOne({ where: { username }});
    if (existing) {
        throw new Error('Username already taken');
    }
    
    // ... rest of registration logic
}
```

### 3. Add Custom Events/Hooks

```javascript
// In auth.js
async login({ username, password, ipAddress, userAgent }) {
    // ... login logic
    
    // Custom event: log login attempt
    await this.models.LoginLog.create({
        userId: user.id,
        ipAddress,
        userAgent,
        success: true,
        timestamp: new Date()
    });
    
    // Custom event: send email notification
    await sendLoginEmail(user.email, { ipAddress, userAgent });
    
    return result;
}
```

### 4. Integrate with Frontend

```javascript
// Frontend login example
async function login(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const { data } = await response.json();
    
    // Store tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data.user;
}

// API helper with auto token refresh
async function apiCall(url, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
    
    // Auto refresh on 401
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        
        const { data } = await refreshResponse.json();
        localStorage.setItem('accessToken', data.accessToken);
        
        // Retry original request
        return apiCall(url, options);
    }
    
    return response;
}
```

---

## Comparison: Before vs After

### Before (Library AuthSystem)

**Pros:**
- Quick to set up
- Built-in functionality
- Less code to write

**Cons:**
- ❌ Limited flexibility for custom logic
- ❌ Tied to framework internals
- ❌ Hard to add custom validation
- ❌ Difficult to customize token logic
- ❌ Can't easily add custom events/hooks

### After (Application-Level Auth)

**Pros:**
- ✅ Complete control over auth logic
- ✅ Easy to add custom validation
- ✅ Custom events and hooks
- ✅ Independent testing
- ✅ Framework stays simple
- ✅ Can integrate any auth provider
- ✅ Custom token generation/validation
- ✅ Business-specific rules

**Cons:**
- More code to write initially (but well-structured)
- Need to maintain auth code (but you control it)

---

## Troubleshooting

### Issue: Tokens not working

**Check:**
1. Token is being sent correctly: `Authorization: Bearer YOUR_TOKEN`
2. Token hasn't expired (24-hour default)
3. Session exists in database
4. User and role are properly associated

### Issue: Permission denied

**Check:**
1. User is authenticated (req.user exists)
2. User has correct role
3. Role has required permission
4. Permission cache is up to date (clear if needed)

### Issue: Can't register users

**Check:**
1. UserRole 'user' exists in database
2. All required models are initialized
3. Database constraints are satisfied
4. Password meets minimum requirements

---

## Summary

✅ **Auth services created** - Full control over authentication logic  
✅ **ACL service created** - Flexible authorization with caching  
✅ **Middleware created** - 6 middleware functions for route protection  
✅ **Auth routes created** - 6 RESTful endpoints with OpenAPI docs  
✅ **Router updated** - Middleware exposed on app for easy access  
✅ **Migration path clear** - Step-by-step guide provided  

**Result:** Maximum flexibility for authentication and authorization while keeping the framework focused on generic CRUD operations.

---

**Date:** October 15, 2025  
**Status:** ✅ Complete and Ready to Use
