/**
 * ACL Plugin for Sequelize REST Framework
 * Provides role-based access control for models and actions
 */

export class ACLPlugin {
    constructor(options = {}) {
        this.config = options.config || {};
        this.getUserRole = options.getUserRole || this.defaultGetUserRole;
        this.onAccessDenied = options.onAccessDenied || this.defaultAccessDenied;
        this.enableJoinFiltering = options.enableJoinFiltering !== false; // default true
    }

    /**
     * Default method to get user role from request
     * Can be overridden in options
     */
    defaultGetUserRole(req) {
        return req.userRoleCode || req.user?.role?.code || 'guest';
    }

    /**
     * Default access denied handler
     */
    defaultAccessDenied(context) {
        const { req, res, model, action, role } = context;
        if (res) {
            return res.status(403).json({
                error: 'Access Denied',
                message: `Role '${role}' does not have permission to '${action}' on '${model}'`,
            });
        }
        throw new Error(`Access Denied: Role '${role}' cannot '${action}' on '${model}'`);
    }

    /**
     * Check if role has permission for model action
     */
    hasPermission(model, action, role) {
        const modelConfig = this.config[model];
        if (!modelConfig) {
            // No config means allow by default (or you can change to deny)
            return true;
        }

        const allowedRoles = modelConfig[action];
        if (!allowedRoles) {
            // No specific action config means allow by default
            return true;
        }

        // Support both Set and Array
        if (allowedRoles instanceof Set) {
            return allowedRoles.has(role);
        }
        if (Array.isArray(allowedRoles)) {
            return allowedRoles.includes(role);
        }

        return false;
    }

    /**
     * Check if role can read/join a specific model
     */
    canReadModel(model, role) {
        return this.hasPermission(model, 'read', role);
    }

    /**
     * Filter JOIN includes based on user permissions
     */
    filterJoinsByPermission(includeClause, role) {
        if (!includeClause || !this.enableJoinFiltering) {
            return includeClause;
        }

        // Handle array of includes
        if (Array.isArray(includeClause)) {
            return includeClause
                .map(inc => this.filterJoinsByPermission(inc, role))
                .filter(inc => inc !== null);
        }

        // Handle single include object
        if (typeof includeClause === 'object') {
            const modelName = includeClause.model?.name || includeClause.association;

            // Check if user has read permission for this model
            if (modelName && !this.canReadModel(modelName, role)) {
                return null; // Remove this include
            }

            // Recursively filter nested includes
            if (includeClause.include) {
                const filteredNested = this.filterJoinsByPermission(includeClause.include, role);
                if (filteredNested === null || (Array.isArray(filteredNested) && filteredNested.length === 0)) {
                    // Remove nested includes if empty
                    const { include, ...rest } = includeClause;
                    return Object.keys(rest).length > 0 ? rest : includeClause;
                }
                return {
                    ...includeClause,
                    include: filteredNested,
                };
            }

            return includeClause;
        }

        return includeClause;
    }

    /**
     * Middleware to check permissions before request
     */
    createMiddleware(model, action) {
        return async (req, res, next) => {
            const role = this.getUserRole(req);

            if (!this.hasPermission(model, action, role)) {
                return this.onAccessDenied({ req, res, model, action, role });
            }

            // Store role in request for later use
            req.aclRole = role;
            next();
        };
    }

    /**
     * Install plugin into framework
     */
    install(pluginManager) {
        // Hook: Before any request - check permissions
        pluginManager.registerHook('beforeRequest', async (context) => {
            const { req, res, model, action } = context;
            const role = this.getUserRole(req);

            if (!this.hasPermission(model, action, role)) {
                this.onAccessDenied({ req, res, model, action, role });
                context.cancel = true; // Signal to stop processing
            }

            context.role = role;
            return context;
        });

        // Hook: Modify query to filter JOINs based on permissions
        pluginManager.registerHook('modifyQuery', async (queryOptions, context) => {
            const { role } = context;

            if (queryOptions.include && this.enableJoinFiltering) {
                queryOptions.include = this.filterJoinsByPermission(queryOptions.include, role);
            }

            return queryOptions;
        });

        // Hook: Filter response data based on permissions
        pluginManager.registerHook('modifyResponse', async (data, context) => {
            const { role } = context;

            // You can add additional filtering here
            // For example, remove sensitive fields based on role

            return data;
        });
    }

    /**
     * Apply ACL to GenericCRUD routes
     */
    static applyToRoutes(app, model, pluginInstance) {
        const actions = ['create', 'read', 'update', 'delete'];
        const middlewares = {};

        actions.forEach(action => {
            middlewares[action] = pluginInstance.createMiddleware(model, action);
        });

        return middlewares;
    }
}

/**
 * Helper to create ACL config
 */
export function createACLConfig(config) {
    // Convert arrays to Sets for better performance
    const normalized = {};

    for (const [model, actions] of Object.entries(config)) {
        normalized[model] = {};
        for (const [action, roles] of Object.entries(actions)) {
            normalized[model][action] = Array.isArray(roles)
                ? new Set(roles)
                : roles;
        }
    }

    return normalized;
}

/**
 * Example ACL configuration
 */
export const exampleACLConfig = createACLConfig({
    Product: {
        create: ['admin', 'manager'],
        read: ['admin', 'manager', 'user', 'guest'],
        update: ['admin', 'manager'],
        delete: ['admin'],
    },
    Order: {
        create: ['admin', 'user'],
        read: ['admin', 'user'], // Only admin and user can read orders
        update: ['admin'],
        delete: ['admin'],
    },
    User: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin'],
    },
    // You can also define JOIN visibility
    OrderItem: {
        read: ['admin', 'user'], // Guests cannot see order items even in JOINs
    },
    UserCredential: {
        read: ['admin'], // Only admins can see credentials
    },
});
