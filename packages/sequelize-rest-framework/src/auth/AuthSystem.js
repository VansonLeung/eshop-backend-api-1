import { UserModel, UserRoleModel, UserPermissionModel, UserRolePermissionMappingModel, UserCredentialModel, UserSessionModel } from './models/UserModels.js';
import { UserAuthService } from './services/UserAuthService.js';
import { UserACLService } from './services/UserACLService.js';
import { AuthMiddleware } from './middleware/AuthMiddleware.js';
import { AuthRoutes } from './routes/AuthRoutes.js';

/**
 * AuthSystem - Complete authentication and authorization system
 *
 * Usage:
 * ```javascript
 * import { AuthSystem } from 'sequelize-rest-framework';
 *
 * const authSystem = new AuthSystem(sequelize);
 * authSystem.initialize();
 *
 * // Mount auth routes
 * app.use('/api/auth', authSystem.getAuthRoutes());
 *
 * // Use middleware
 * app.get('/protected', authSystem.authenticate(), (req, res) => {
 *   res.json({ user: req.user });
 * });
 * ```
 */
export class AuthSystem {
    constructor(sequelize, options = {}) {
        this.sequelize = sequelize;
        this.options = {
            modelPrefix: options.modelPrefix || 'EB',
            tablePrefix: options.tablePrefix || 'eb_',
            tokenExpiry: options.tokenExpiry || 24 * 60 * 60 * 1000, // 24 hours
            saltRounds: options.saltRounds || 10,
            ...options,
        };

        this.models = {};
        this.services = {};
        this.middleware = null;
        this.routes = null;
    }

    /**
     * Initialize all models and services
     * @param {object} existingModels - Optional existing models to use instead of creating new ones
     */
    initialize(existingModels = {}) {
        if (existingModels.User) {
            // Use existing models from the app
            this.models = existingModels;
        } else {
            // Create new models
            this.defineModels();
            this.createAssociations();
        }

        this.initializeServices();
        this.initializeMiddleware();
        this.initializeRoutes();

        return this;
    }

    /**
     * Define all user-related models
     */
    defineModels() {
        const { modelPrefix, tablePrefix } = this.options;

        // User model
        this.models.User = this.sequelize.define(
            `${modelPrefix}User`,
            UserModel.makeSchema(),
            {
                tableName: `${tablePrefix}user`,
                timestamps: true,
                paranoid: true,
            }
        );

        // UserRole model
        this.models.UserRole = this.sequelize.define(
            `${modelPrefix}UserRole`,
            UserRoleModel.makeSchema(),
            {
                tableName: `${tablePrefix}user_role`,
                timestamps: true,
                paranoid: true,
            }
        );

        // UserPermission model
        this.models.UserPermission = this.sequelize.define(
            `${modelPrefix}UserPermission`,
            UserPermissionModel.makeSchema(),
            {
                tableName: `${tablePrefix}user_permission`,
                timestamps: true,
                paranoid: true,
            }
        );

        // UserRolePermissionMapping model
        this.models.UserRolePermissionMapping = this.sequelize.define(
            `${modelPrefix}UserRolePermissionMapping`,
            UserRolePermissionMappingModel.makeSchema(),
            {
                tableName: `${tablePrefix}user_role_permission_mapping`,
                timestamps: true,
            }
        );

        // UserCredential model
        this.models.UserCredential = this.sequelize.define(
            `${modelPrefix}UserCredential`,
            UserCredentialModel.makeSchema(),
            {
                tableName: `${tablePrefix}user_credential`,
                timestamps: true,
                paranoid: true,
            }
        );

        // UserSession model
        this.models.UserSession = this.sequelize.define(
            `${modelPrefix}UserSession`,
            UserSessionModel.makeSchema(),
            {
                tableName: `${tablePrefix}user_session`,
                timestamps: true,
                paranoid: true,
            }
        );
    }

    /**
     * Create associations between models
     */
    createAssociations() {
        const { User, UserRole, UserPermission, UserRolePermissionMapping, UserCredential, UserSession } = this.models;

        UserModel.makeAssociations({ User, UserRole, UserCredential, UserSession, UserPermission });
        UserRoleModel.makeAssociations({ User, UserRole, UserRolePermissionMapping });
        UserPermissionModel.makeAssociations({ UserPermission, UserRolePermissionMapping });
        UserRolePermissionMappingModel.makeAssociations({ UserRole, UserPermission, UserRolePermissionMapping });
        UserCredentialModel.makeAssociations({ User, UserCredential, UserSession });
        UserSessionModel.makeAssociations({ User, UserCredential, UserSession });
    }

    /**
     * Initialize services
     */
    initializeServices() {
        const { User, UserRole, UserPermission, UserRolePermissionMapping, UserCredential, UserSession } = this.models;

        this.services.auth = new UserAuthService({
            User,
            UserCredential,
            UserSession,
            UserRole,
        });

        // Set custom options
        if (this.options.tokenExpiry) {
            this.services.auth.tokenExpiry = this.options.tokenExpiry;
        }
        if (this.options.saltRounds) {
            this.services.auth.saltRounds = this.options.saltRounds;
        }

        this.services.acl = new UserACLService({
            User,
            UserRole,
            UserPermission,
            UserRolePermissionMapping,
        });
    }

    /**
     * Initialize middleware
     */
    initializeMiddleware() {
        this.middleware = new AuthMiddleware(
            this.services.auth,
            this.services.acl
        );
    }

    /**
     * Initialize routes
     */
    initializeRoutes() {
        this.routes = new AuthRoutes(
            this.services.auth,
            this.middleware
        );
    }

    /**
     * Get authentication middleware
     */
    authenticate() {
        return this.middleware.authenticate();
    }

    /**
     * Get authorization middleware for resource/action
     */
    authorize(resource, action) {
        return this.middleware.authorize(resource, action);
    }

    /**
     * Get minimum level middleware
     */
    requireLevel(level) {
        return this.middleware.requireLevel(level);
    }

    /**
     * Get optional auth middleware
     */
    optionalAuth() {
        return this.middleware.optionalAuth();
    }

    /**
     * Get auth router
     */
    getAuthRoutes() {
        return this.routes.getRouter();
    }

    /**
     * Get all models
     */
    getModels() {
        return this.models;
    }

    /**
     * Get auth service
     */
    getAuthService() {
        return this.services.auth;
    }

    /**
     * Get ACL service
     */
    getACLService() {
        return this.services.acl;
    }

    /**
     * Get middleware instance
     */
    getMiddleware() {
        return this.middleware;
    }

    /**
     * Sync models to database
     */
    async sync(options = {}) {
        await this.sequelize.sync(options);
    }

    /**
     * Seed initial data (default roles and permissions)
     */
    async seedDefaults() {
        const { UserRole, UserPermission, UserRolePermissionMapping } = this.models;

        // Create default roles
        const [adminRole] = await UserRole.findOrCreate({
            where: { code: 'admin' },
            defaults: {
                code: 'admin',
                name: 'Administrator',
                level: 100,
                status: 'active',
            }
        });

        const [userRole] = await UserRole.findOrCreate({
            where: { code: 'user' },
            defaults: {
                code: 'user',
                name: 'User',
                level: 10,
                status: 'active',
            }
        });

        const [guestRole] = await UserRole.findOrCreate({
            where: { code: 'guest' },
            defaults: {
                code: 'guest',
                name: 'Guest',
                level: 0,
                status: 'active',
            }
        });

        // Create default permissions
        const [adminPermission] = await UserPermission.findOrCreate({
            where: { code: 'admin_all' },
            defaults: {
                code: 'admin_all',
                resource: '*',
                action: '*',
                name: 'Full Admin Access',
                status: 'active',
            }
        });

        // Assign admin permission to admin role
        await UserRolePermissionMapping.findOrCreate({
            where: {
                userRoleId: adminRole.id,
                userPermissionId: adminPermission.id,
            },
            defaults: {
                userRoleId: adminRole.id,
                userPermissionId: adminPermission.id,
                status: 'active',
            }
        });

        return {
            roles: { admin: adminRole, user: userRole, guest: guestRole },
            permissions: { adminAll: adminPermission },
        };
    }
}
