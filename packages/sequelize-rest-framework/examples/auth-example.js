/**
 * Example: Using the built-in Authentication and Authorization System
 *
 * This example demonstrates how to:
 * 1. Initialize the AuthSystem
 * 2. Set up authentication routes
 * 3. Protect routes with authentication middleware
 * 4. Use role-based access control (RBAC)
 * 5. Seed default roles and permissions
 */

import express from 'express';
import { Sequelize } from 'sequelize';
import { AuthSystem } from '../src/index.js';

// Initialize Sequelize
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'my_app',
});

// Initialize Express
const app = express();
app.use(express.json());

// ============================================
// 1. Initialize AuthSystem
// ============================================
const authSystem = new AuthSystem(sequelize, {
    modelPrefix: 'EB',          // Prefix for model names (e.g., EBUser)
    tablePrefix: 'eb_',         // Prefix for table names (e.g., eb_user)
    tokenExpiry: 24 * 60 * 60 * 1000,  // 24 hours
    saltRounds: 10,             // bcrypt salt rounds
});

// Initialize models and services
authSystem.initialize();

// ============================================
// 2. Mount Authentication Routes
// ============================================
// Provides: POST /auth/register, /auth/login, /auth/refresh, /auth/logout, etc.
app.use('/api/auth', authSystem.getAuthRoutes());

// ============================================
// 3. Protected Routes - Require Authentication
// ============================================

// Get user profile - requires authentication
app.get('/api/profile',
    authSystem.authenticate(),
    (req, res) => {
        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.userRole.code,
            }
        });
    }
);

// ============================================
// 4. Role-Based Access Control (RBAC)
// ============================================

// Admin only route - requires specific permission
app.get('/api/admin/users',
    authSystem.authenticate(),
    authSystem.authorize('User', 'read'),  // Check User:read permission
    async (req, res) => {
        const users = await authSystem.getModels().User.findAll({
            attributes: ['id', 'username', 'email', 'status'],
        });
        res.json({ users });
    }
);

// Admin only route - requires minimum role level
app.delete('/api/admin/users/:id',
    authSystem.authenticate(),
    authSystem.requireLevel(100),  // Admin level = 100
    async (req, res) => {
        await authSystem.getModels().User.update(
            { status: 'deleted' },
            { where: { id: req.params.id } }
        );
        res.json({ success: true });
    }
);

// ============================================
// 5. Optional Authentication
// ============================================

// Public route with optional user context
app.get('/api/public/posts',
    authSystem.optionalAuth(),  // Doesn't fail if no token
    async (req, res) => {
        // req.user will be set if authenticated, undefined otherwise
        const query = req.user ? { status: 'published' } : { status: 'public' };

        // ... fetch posts based on auth status
        res.json({
            authenticated: !!req.user,
            user: req.user?.username,
        });
    }
);

// ============================================
// 6. Initialize Database and Seed
// ============================================

async function bootstrap() {
    try {
        // Sync database
        await authSystem.sync({ alter: true });
        console.log('✓ Database synced');

        // Seed default roles and permissions
        const defaults = await authSystem.seedDefaults();
        console.log('✓ Default roles and permissions seeded');
        console.log('  - Roles:', Object.keys(defaults.roles));

        // Create a test admin user
        const aclService = authSystem.getACLService();
        const authService = authSystem.getAuthService();

        const adminUser = await authService.register({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            userRoleId: defaults.roles.admin.id,
        });
        console.log('✓ Admin user created:', adminUser.username);

        // Create a regular user
        const regularUser = await authService.register({
            username: 'user1',
            email: 'user1@example.com',
            password: 'user123',
            firstName: 'Regular',
            lastName: 'User',
            userRoleId: defaults.roles.user.id,
        });
        console.log('✓ Regular user created:', regularUser.username);

        // Create custom permissions
        const readProductPermission = await aclService.createPermission({
            code: 'read_product',
            resource: 'Product',
            action: 'read',
            name: 'Read Products',
            description: 'Can view product listings',
        });
        console.log('✓ Custom permission created:', readProductPermission.code);

        // Assign permission to user role
        await aclService.assignPermissionToRole(
            defaults.roles.user.id,
            readProductPermission.id
        );
        console.log('✓ Permission assigned to user role');

        // Start server
        app.listen(3000, () => {
            console.log('\n🚀 Server running on http://localhost:3000');
            console.log('\nAvailable endpoints:');
            console.log('  POST   /api/auth/register    - Register new user');
            console.log('  POST   /api/auth/login       - Login');
            console.log('  POST   /api/auth/logout      - Logout');
            console.log('  POST   /api/auth/refresh     - Refresh token');
            console.log('  GET    /api/auth/me          - Get current user');
            console.log('  GET    /api/auth/verify      - Verify token');
            console.log('  POST   /api/auth/change-password - Change password');
            console.log('  GET    /api/profile          - Get profile (protected)');
            console.log('  GET    /api/admin/users      - List users (admin only)');
            console.log('  DELETE /api/admin/users/:id  - Delete user (admin only)');
            console.log('  GET    /api/public/posts     - Public with optional auth');
            console.log('\nTest credentials:');
            console.log('  Admin: admin@example.com / admin123');
            console.log('  User:  user1@example.com / user123');
        });

    } catch (error) {
        console.error('Bootstrap error:', error);
        process.exit(1);
    }
}

// ============================================
// 7. Usage Examples with curl
// ============================================

/*

# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin@example.com",
    "password": "admin123"
  }'

# Response will include:
# {
#   "success": true,
#   "user": {...},
#   "accessToken": "abc123...",
#   "refreshToken": "xyz789...",
#   "expiresAt": "2024-01-01T00:00:00.000Z"
# }

# Use access token for protected routes
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get current user
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'

# Change password
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "admin123",
    "newPassword": "newpass123"
  }'

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Admin route (requires permission)
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"

*/

// ============================================
// 8. Programmatic API Usage
// ============================================

async function programmaticExamples() {
    const authService = authSystem.getAuthService();
    const aclService = authSystem.getACLService();

    // Register user
    const user = await authService.register({
        username: 'programmatic',
        email: 'prog@example.com',
        password: 'pass123',
    });

    // Login
    const loginResult = await authService.login({
        login: 'programmatic',
        password: 'pass123',
        ipAddress: '127.0.0.1',
        userAgent: 'Node.js',
    });
    console.log('Access token:', loginResult.accessToken);

    // Verify token
    const verifiedUser = await authService.verifyToken(loginResult.accessToken);
    console.log('Verified user:', verifiedUser.username);

    // Check permission
    const hasPermission = await aclService.hasPermission(
        user.id,
        'Product',
        'read'
    );
    console.log('Has read permission:', hasPermission);

    // Get user permissions
    const permissions = await aclService.getUserPermissions(user.id);
    console.log('User permissions:', permissions.length);

    // Logout
    await authService.logout(loginResult.accessToken);
    console.log('Logged out');
}

// Run bootstrap
bootstrap();
