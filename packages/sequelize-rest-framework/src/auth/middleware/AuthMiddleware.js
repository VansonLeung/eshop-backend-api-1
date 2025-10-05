/**
 * Authentication Middleware
 * Validates tokens and attaches user to request
 */
export class AuthMiddleware {
    constructor(userAuthService, userACLService) {
        this.userAuthService = userAuthService;
        this.userACLService = userACLService;
    }

    /**
     * Middleware to verify JWT token and attach user to request
     */
    authenticate() {
        return async (req, res, next) => {
            try {
                // Extract token from Authorization header
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    return res.status(401).json({ error: 'No authorization header' });
                }

                const token = authHeader.startsWith('Bearer ')
                    ? authHeader.substring(7)
                    : authHeader;

                // Verify token
                const user = await this.userAuthService.verifyToken(token);

                // Attach user to request
                req.user = user;
                req.userRole = user.userRole;

                next();
            } catch (error) {
                return res.status(401).json({ error: error.message });
            }
        };
    }

    /**
     * Middleware to check if user has permission for resource/action
     */
    authorize(resource, action) {
        return async (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: 'Not authenticated' });
                }

                const hasPermission = await this.userACLService.roleHasPermission(
                    req.userRole,
                    resource,
                    action
                );

                if (!hasPermission) {
                    return res.status(403).json({
                        error: 'Insufficient permissions',
                        required: { resource, action }
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        };
    }

    /**
     * Middleware to check minimum role level
     */
    requireLevel(minimumLevel) {
        return async (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: 'Not authenticated' });
                }

                if (!req.userRole || req.userRole.level < minimumLevel) {
                    return res.status(403).json({
                        error: 'Insufficient role level',
                        required: minimumLevel,
                        current: req.userRole?.level || 0
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        };
    }

    /**
     * Optional authentication - doesn't fail if no token
     */
    optionalAuth() {
        return async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                if (authHeader) {
                    const token = authHeader.startsWith('Bearer ')
                        ? authHeader.substring(7)
                        : authHeader;

                    const user = await this.userAuthService.verifyToken(token);
                    req.user = user;
                    req.userRole = user.userRole;
                }
            } catch (error) {
                // Ignore errors for optional auth
            }
            next();
        };
    }
}
