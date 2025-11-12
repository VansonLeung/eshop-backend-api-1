import { AuthService } from '../services/auth.js';
import { ACLService } from '../services/acl.js';

/**
 * Create authentication and authorization middleware
 * @param {Object} models - Sequelize models
 * @returns {Object} Middleware functions
 */
export const createAuthMiddleware = (models) => {
    const authService = new AuthService(models);
    const aclService = new ACLService(models);

    return {
        /**
         * Authenticate middleware - Requires valid access token
         * Attaches user, userRole, and session to req object
         * Returns 401 if token is missing or invalid
         */
        authenticate: () => async (req, res, next) => {
            try {
                const token = req.headers.authorization?.replace('Bearer ', '');
                
                if (!token) {
                    return res.status(401).json({ 
                        success: false,
                        error: 'No token provided',
                        message: 'Authorization token is required'
                    });
                }
                
                const session = await authService.verifyToken(token);
                
                if (!session) {
                    return res.status(401).json({ 
                        success: false,
                        error: 'Invalid or expired token',
                        message: 'Please login again'
                    });
                }
                
                // Attach user info to request
                req.user = session.user;
                req.userRole = session.user.role;
                req.session = session;
                
                next();
            } catch (error) {
                return res.status(401).json({ 
                    success: false,
                    error: 'Authentication failed',
                    message: error.message
                });
            }
        },

        /**
         * Require role middleware - Check if user has one of allowed roles
         * @param {Array<string>} allowedRoles - Array of role codes (e.g., ['admin', 'manager'])
         */
        requireRole: (allowedRoles) => async (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ 
                        success: false,
                        error: 'Not authenticated',
                        message: 'Please login first'
                    });
                }
                
                const userRoleCode = req.userRole?.code || 'guest';
                
                if (!allowedRoles.includes(userRoleCode)) {
                    return res.status(403).json({ 
                        success: false,
                        error: 'Insufficient permissions',
                        message: `Requires one of: ${allowedRoles.join(', ')}`,
                        requiredRoles: allowedRoles,
                        userRole: userRoleCode
                    });
                }
                
                next();
            } catch (error) {
                return res.status(403).json({ 
                    success: false,
                    error: 'Authorization failed',
                    message: error.message
                });
            }
        },

        /**
         * Require permission middleware - Check specific resource/action permission
         * @param {string} resource - Resource name (e.g., 'Product', 'Order')
         * @param {string} action - Action name (e.g., 'create', 'read', 'update', 'delete')
         */
        requirePermission: (resource, action) => async (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ 
                        success: false,
                        error: 'Not authenticated',
                        message: 'Please login first'
                    });
                }
                
                const hasAccess = await aclService.hasPermission(
                    req.user.id, 
                    resource, 
                    action
                );
                
                if (!hasAccess) {
                    return res.status(403).json({ 
                        success: false,
                        error: `No permission to ${action} ${resource}`,
                        message: 'You do not have permission to perform this action',
                        requiredPermission: { resource, action }
                    });
                }
                
                next();
            } catch (error) {
                return res.status(403).json({ 
                    success: false,
                    error: 'Authorization failed',
                    message: error.message
                });
            }
        },

        /**
         * Require minimum level middleware - Check if user has minimum role level
         * @param {number} minimumLevel - Minimum role level required
         */
        requireLevel: (minimumLevel) => async (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ 
                        success: false,
                        error: 'Not authenticated',
                        message: 'Please login first'
                    });
                }
                
                const hasLevel = await aclService.hasMinimumLevel(
                    req.user.id, 
                    minimumLevel
                );
                
                if (!hasLevel) {
                    return res.status(403).json({ 
                        success: false,
                        error: 'Insufficient level',
                        message: `Requires minimum level: ${minimumLevel}`,
                        requiredLevel: minimumLevel,
                        userLevel: req.userRole?.level || 0
                    });
                }
                
                next();
            } catch (error) {
                return res.status(403).json({ 
                    success: false,
                    error: 'Authorization failed',
                    message: error.message
                });
            }
        },

        /**
         * Optional auth middleware - Attaches user if token provided, but doesn't fail if missing
         */
        optionalAuth: () => async (req, res, next) => {
            try {
                const token = req.headers.authorization?.replace('Bearer ', '');
                
                if (token) {
                    const session = await authService.verifyToken(token);
                    if (session) {
                        req.user = session.user;
                        req.userRole = session.user.role;
                        req.session = session;
                    }
                }
                
                next();
            } catch (error) {
                // Don't fail on error for optional auth
                next();
            }
        },

        /**
         * Check ACL config middleware - Simple role-based access using config object
         * @param {string} modelName - Model name
         * @param {string} action - Action name
         * @param {Object} aclConfig - ACL configuration object
         * 
         * Example aclConfig:
         * {
         *   Product: {
         *     create: ['admin', 'manager'],
         *     read: ['admin', 'user', 'guest'],
         *     update: ['admin'],
         *     delete: ['admin']
         *   }
         * }
         */
        checkACL: (modelName, action, aclConfig) => async (req, res, next) => {
            try {
                const userRoleCode = req.userRole?.code || 'guest';
                const allowedRoles = aclConfig[modelName]?.[action] || [];
                
                if (!allowedRoles.includes(userRoleCode)) {
                    return res.status(403).json({ 
                        success: false,
                        error: 'Access denied',
                        message: `${userRoleCode} role cannot ${action} ${modelName}`,
                        requiredRoles: allowedRoles,
                        userRole: userRoleCode
                    });
                }
                
                next();
            } catch (error) {
                return res.status(403).json({ 
                    success: false,
                    error: 'Authorization failed',
                    message: error.message
                });
            }
        },

        /**
         * Get the auth and ACL services for use in routes
         */
        getServices: () => ({ authService, aclService }),
    };
};
