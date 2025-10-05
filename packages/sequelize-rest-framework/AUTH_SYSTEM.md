# Built-in Authentication & Authorization System

The Sequelize REST Framework includes a complete, production-ready authentication and authorization system with built-in User, Role, and Permission management.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Integration with Plugins](#integration-with-plugins)
- [Advanced Configuration](#advanced-configuration)

## Features

✅ **Complete User Management**
- User registration and authentication
- Password hashing with bcrypt
- OAuth support (Google, Facebook, Twitter, GitHub)
- Multi-credential support per user

✅ **Session Management**
- Access token and refresh token system
- Token expiration and renewal
- IP address and user agent tracking
- Multiple concurrent sessions
- Session invalidation (logout/logout all)

✅ **Role-Based Access Control (RBAC)**
- Hierarchical roles with levels
- Fine-grained permissions per resource/action
- Many-to-many role-permission mapping
- Permission caching for performance

✅ **Middleware & Routes**
- Pre-built authentication middleware
- Authorization middleware (permission-based)
- Level-based authorization
- Complete REST API routes
- Optional authentication support

✅ **Security**
- Password hashing (bcrypt)
- Secure token generation (crypto)
- Soft deletes for users
- Status tracking (active/inactive/deleted)

## Quick Start

### 1. Initialize AuthSystem

```javascript
import { Sequelize } from 'sequelize';
import { AuthSystem } from 'sequelize-rest-framework';

const sequelize = new Sequelize(/* your config */);

const authSystem = new AuthSystem(sequelize, {
    modelPrefix: 'EB',                    // Model name prefix
    tablePrefix: 'eb_',                   // Table name prefix
    tokenExpiry: 24 * 60 * 60 * 1000,    // 24 hours
    saltRounds: 10,                       // bcrypt rounds
});

authSystem.initialize();
```

### 2. Sync Database

```javascript
await authSystem.sync({ alter: true });
```

### 3. Seed Default Data

```javascript
const defaults = await authSystem.seedDefaults();
// Creates: admin, user, guest roles
// Creates: admin_all permission
```

### 4. Mount Routes

```javascript
import express from 'express';
const app = express();

app.use('/api/auth', authSystem.getAuthRoutes());
```

### 5. Protect Routes

```javascript
// Require authentication
app.get('/api/profile',
    authSystem.authenticate(),
    (req, res) => {
        res.json({ user: req.user });
    }
);

// Require specific permission
app.delete('/api/products/:id',
    authSystem.authenticate(),
    authSystem.authorize('Product', 'delete'),
    (req, res) => {
        // Delete product
    }
);

// Require role level
app.get('/api/admin/settings',
    authSystem.authenticate(),
    authSystem.requireLevel(100),
    (req, res) => {
        // Admin only
    }
);
```

## Database Schema

### User Model
- `id` (UUID)
- `username` (unique)
- `email` (unique)
- `firstName`
- `lastName`
- `userRoleId` → UserRole
- `status` (active/inactive/deleted)
- `createdAt`, `updatedAt`, `deletedAt`

### UserRole Model
- `id` (UUID)
- `code` (unique) - e.g., "admin", "user"
- `name` - Display name
- `level` (integer) - Higher = more permissions
- `status`
- `createdAt`, `updatedAt`, `deletedAt`

### UserPermission Model
- `id` (UUID)
- `code` (unique) - e.g., "product_read"
- `resource` - Model name (e.g., "Product") or "*"
- `action` - Action name (e.g., "read") or "*"
- `name` - Display name
- `description`
- `status`
- `createdAt`, `updatedAt`, `deletedAt`

### UserRolePermissionMapping Model
- `id` (UUID)
- `userRoleId` → UserRole
- `userPermissionId` → UserPermission
- `status`
- `createdAt`, `updatedAt`

### UserCredential Model
- `id` (UUID)
- `userId` → User
- `type` (password/google/facebook/twitter/github)
- `password` (hashed)
- `provider` - OAuth provider name
- `providerId` - OAuth provider user ID
- `status`
- `createdAt`, `updatedAt`, `deletedAt`

### UserSession Model
- `id` (UUID)
- `userId` → User
- `userCredentialId` → UserCredential
- `accessToken` (unique)
- `refreshToken` (unique)
- `expiresAt`
- `ipAddress`
- `userAgent`
- `status`
- `createdAt`, `updatedAt`, `deletedAt`

## API Reference

### AuthSystem Class

#### Constructor

```javascript
new AuthSystem(sequelize, options)
```

**Options:**
- `modelPrefix` - Prefix for model names (default: "EB")
- `tablePrefix` - Prefix for table names (default: "eb_")
- `tokenExpiry` - Token expiration in ms (default: 24 hours)
- `saltRounds` - bcrypt salt rounds (default: 10)

#### Methods

```javascript
// Initialize all models and services
authSystem.initialize()

// Sync models to database
await authSystem.sync(options)

// Seed default roles and permissions
await authSystem.seedDefaults()

// Get middleware functions
authSystem.authenticate()           // Require valid token
authSystem.authorize(resource, action)  // Require permission
authSystem.requireLevel(level)      // Require minimum role level
authSystem.optionalAuth()           // Optional authentication

// Get router
authSystem.getAuthRoutes()          // Express router with auth endpoints

// Get services
authSystem.getAuthService()         // UserAuthService instance
authSystem.getACLService()          // UserACLService instance
authSystem.getModels()              // All user-related models
```

### UserAuthService

```javascript
const authService = authSystem.getAuthService();

// Register new user
await authService.register({
    username: 'user1',
    email: 'user@example.com',
    password: 'pass123',
    firstName: 'John',
    lastName: 'Doe',
    userRoleId: roleId,
});

// Login
const result = await authService.login({
    login: 'user1',           // username or email
    password: 'pass123',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
});
// Returns: { user, session, accessToken, refreshToken, expiresAt }

// Verify token
const user = await authService.verifyToken(accessToken);

// Refresh token
const result = await authService.refreshToken(refreshToken, ipAddress, userAgent);

// Logout
await authService.logout(accessToken);

// Logout all sessions
await authService.logoutAll(userId);

// Change password
await authService.changePassword(userId, oldPassword, newPassword);

// Clean expired sessions
await authService.cleanExpiredSessions();
```

### UserACLService

```javascript
const aclService = authSystem.getACLService();

// Check user permission
const hasPermission = await aclService.hasPermission(userId, 'Product', 'read');

// Check role permission
const hasPermission = await aclService.roleHasPermission(userRole, 'Product', 'read');

// Get user permissions
const permissions = await aclService.getUserPermissions(userId);

// Get role permissions
const permissions = await aclService.getRolePermissions(roleId);

// Create permission
const permission = await aclService.createPermission({
    code: 'product_create',
    resource: 'Product',
    action: 'create',
    name: 'Create Products',
    description: 'Can create new products',
});

// Create role
const role = await aclService.createRole({
    code: 'manager',
    name: 'Manager',
    level: 50,
    description: 'Manager role',
});

// Assign permission to role
await aclService.assignPermissionToRole(roleId, permissionId);

// Remove permission from role
await aclService.removePermissionFromRole(roleId, permissionId);

// Assign role to user
await aclService.assignRoleToUser(userId, roleId);

// Check minimum level
const hasLevel = await aclService.hasMinimumLevel(userId, 50);

// Clear cache
aclService.clearCache();
aclService.clearRoleCache(roleId);
```

## Built-in Routes

All routes are mounted at the path you specify (e.g., `/api/auth`):

### POST /register
Register a new user.

**Request:**
```json
{
  "username": "user1",
  "email": "user@example.com",
  "password": "pass123",
  "firstName": "John",
  "lastName": "Doe",
  "userRoleId": "uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "user1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### POST /login
Login with username/email and password.

**Request:**
```json
{
  "login": "user1",
  "password": "pass123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {...},
  "accessToken": "abc123...",
  "refreshToken": "xyz789...",
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "xyz789..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {...},
  "accessToken": "new-token...",
  "refreshToken": "new-refresh...",
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /logout
Logout current session (requires auth).

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /logout-all
Logout all sessions for current user (requires auth).

### GET /me
Get current user information (requires auth).

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "user1",
    "email": "user@example.com",
    "userRole": {...}
  }
}
```

### POST /change-password
Change password (requires auth).

**Request:**
```json
{
  "oldPassword": "old123",
  "newPassword": "new123"
}
```

### GET /verify
Verify if token is valid (requires auth).

## Usage Examples

### Example 1: Basic Setup

```javascript
import express from 'express';
import { Sequelize } from 'sequelize';
import { AuthSystem } from 'sequelize-rest-framework';

const app = express();
app.use(express.json());

const sequelize = new Sequelize(/* config */);
const authSystem = new AuthSystem(sequelize);
authSystem.initialize();

// Mount auth routes
app.use('/api/auth', authSystem.getAuthRoutes());

// Protected route
app.get('/api/dashboard',
    authSystem.authenticate(),
    (req, res) => {
        res.json({
            message: `Welcome ${req.user.username}`,
            role: req.userRole.code,
        });
    }
);

await authSystem.sync();
await authSystem.seedDefaults();

app.listen(3000);
```

### Example 2: Custom Permissions

```javascript
const aclService = authSystem.getACLService();

// Create custom permissions
const readPerm = await aclService.createPermission({
    code: 'product_read',
    resource: 'Product',
    action: 'read',
    name: 'Read Products',
});

const createPerm = await aclService.createPermission({
    code: 'product_create',
    resource: 'Product',
    action: 'create',
    name: 'Create Products',
});

// Create custom role
const managerRole = await aclService.createRole({
    code: 'manager',
    name: 'Manager',
    level: 50,
});

// Assign permissions to role
await aclService.assignPermissionToRole(managerRole.id, readPerm.id);
await aclService.assignPermissionToRole(managerRole.id, createPerm.id);

// Assign role to user
await aclService.assignRoleToUser(userId, managerRole.id);
```

### Example 3: Wildcard Permissions

```javascript
// Grant read access to all resources
await aclService.createPermission({
    code: 'read_all',
    resource: '*',
    action: 'read',
    name: 'Read All Resources',
});

// Grant all actions on a specific resource
await aclService.createPermission({
    code: 'product_all',
    resource: 'Product',
    action: '*',
    name: 'All Product Actions',
});

// Grant all actions on all resources (superuser)
await aclService.createPermission({
    code: 'superuser',
    resource: '*',
    action: '*',
    name: 'Superuser',
});
```

### Example 4: Mixed Authorization

```javascript
// Require both authentication and specific permission
app.delete('/api/products/:id',
    authSystem.authenticate(),
    authSystem.authorize('Product', 'delete'),
    async (req, res) => {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    }
);

// Or check programmatically
app.post('/api/orders',
    authSystem.authenticate(),
    async (req, res) => {
        const canCreate = await aclService.hasPermission(
            req.user.id,
            'Order',
            'create'
        );

        if (!canCreate) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        // Create order...
    }
);
```

## Integration with Plugins

The AuthSystem works seamlessly with the ACLPlugin for automatic route protection:

```javascript
import { AuthSystem, ACLPlugin, pluginManager } from 'sequelize-rest-framework';

// Initialize auth system
const authSystem = new AuthSystem(sequelize);
authSystem.initialize();

// Configure ACL plugin to use AuthSystem
const aclPlugin = new ACLPlugin({
    Product: {
        create: ['admin', 'manager'],
        read: ['admin', 'manager', 'user'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },
    Order: {
        create: ['admin', 'manager', 'user'],
        read: ['admin', 'manager', 'user'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },
}, {
    // Use AuthSystem's ACL service
    roleResolver: async (req) => {
        return req.userRole?.code || 'guest';
    },
});

pluginManager.use(aclPlugin);
```

## Advanced Configuration

### Custom Token Generation

```javascript
class CustomAuthService extends UserAuthService {
    generateToken() {
        // Use JWT instead of random tokens
        return jwt.sign({ random: crypto.randomBytes(16) }, secret);
    }
}

// Replace service
authSystem.services.auth = new CustomAuthService({...});
```

### Custom User Validation

```javascript
class CustomAuthService extends UserAuthService {
    async register(data) {
        // Custom validation
        if (data.username.length < 5) {
            throw new Error('Username must be at least 5 characters');
        }

        return super.register(data);
    }
}
```

### OAuth Integration

```javascript
// Google OAuth example
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;

    // Exchange code for Google user info
    const googleUser = await getGoogleUserInfo(code);

    // Find or create user
    let user = await authSystem.getModels().User.findOne({
        where: { email: googleUser.email }
    });

    if (!user) {
        user = await authSystem.getModels().User.create({
            username: googleUser.email,
            email: googleUser.email,
            firstName: googleUser.given_name,
            lastName: googleUser.family_name,
            status: 'active',
        });

        await authSystem.getModels().UserCredential.create({
            userId: user.id,
            type: 'google',
            provider: 'google',
            providerId: googleUser.id,
            status: 'active',
        });
    }

    // Create session
    const authService = authSystem.getAuthService();
    const accessToken = authService.generateToken();
    const refreshToken = authService.generateToken();

    await authSystem.getModels().UserSession.create({
        userId: user.id,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + authService.tokenExpiry),
        status: 'active',
    });

    res.json({ accessToken, refreshToken });
});
```

### Multi-Tenant Support

```javascript
// Add tenant field to User model
const authSystem = new AuthSystem(sequelize);
authSystem.initialize();

// Extend User model
authSystem.getModels().User.addHook('beforeCreate', (user) => {
    user.tenantId = req.tenant.id;
});

// Filter by tenant in middleware
app.use((req, res, next) => {
    if (req.user) {
        req.tenant = { id: req.user.tenantId };
    }
    next();
});
```

## Best Practices

1. **Always use HTTPS in production** - Tokens are bearer tokens
2. **Set appropriate token expiry** - Balance security and UX
3. **Implement refresh token rotation** - Enhanced security
4. **Use permission caching** - Better performance
5. **Regular session cleanup** - Run `cleanExpiredSessions()` periodically
6. **Soft delete users** - Maintain data integrity
7. **Validate input** - Username/email/password requirements
8. **Rate limiting** - Prevent brute force attacks
9. **Log authentication events** - Security audit trail
10. **Use role levels wisely** - Admin = 100, Manager = 50, User = 10, Guest = 0

## Migration from Existing Systems

If you have existing user tables, you can migrate to the AuthSystem:

```javascript
// 1. Initialize AuthSystem with same table names
const authSystem = new AuthSystem(sequelize, {
    modelPrefix: 'EB',
    tablePrefix: 'eb_',  // Match your existing prefix
});

// 2. Sync without force (won't drop tables)
await authSystem.sync({ alter: false });

// 3. Migrate existing data
const existingUsers = await OldUserModel.findAll();
for (const oldUser of existingUsers) {
    await authSystem.getModels().User.create({
        id: oldUser.id,
        username: oldUser.username,
        email: oldUser.email,
        // ... map other fields
    });
}

// 4. Migrate passwords
for (const oldCred of existingCredentials) {
    await authSystem.getModels().UserCredential.create({
        userId: oldCred.userId,
        type: 'password',
        password: oldCred.hashedPassword,  // Already hashed
    });
}
```

## License

MIT
