import { CustomRoutes } from 'sequelize-rest-framework';
import { AuthService } from '../../services/auth.js';

/**
 * Create authentication routes
 * @param {Object} models - Sequelize models
 * @returns {Array} Array of CustomRoutes
 */
export const createAuthRoutes = (models) => {
    const authService = new AuthService(models);

    return [
        // Register new user
        CustomRoutes.createRoute(
            'POST',
            '/api/auth/register',
            async ({ req, res }) => {
                try {
                    const { username, email, password, roleId } = req.body;
                    
                    if (!username || !email || !password) {
                        return res.status(400).json({
                            success: false,
                            error: 'Missing required fields',
                            message: 'username, email, and password are required'
                        });
                    }
                    
                    const user = await authService.register({ 
                        username, 
                        email, 
                        password, 
                        roleId 
                    });
                    
                    return {
                        success: true,
                        message: 'User registered successfully',
                        data: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                        }
                    };
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        error: 'Registration failed',
                        message: error.message
                    });
                }
            },
            {
                summary: 'Register new user',
                description: 'Create a new user account with username, email, and password',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['username', 'email', 'password'],
                                properties: {
                                    username: { 
                                        type: 'string',
                                        description: 'Unique username',
                                        example: 'john_doe'
                                    },
                                    email: { 
                                        type: 'string',
                                        format: 'email',
                                        description: 'User email address',
                                        example: 'john@example.com'
                                    },
                                    password: { 
                                        type: 'string',
                                        format: 'password',
                                        description: 'User password (will be hashed)',
                                        example: 'securePassword123'
                                    },
                                    roleId: {
                                        type: 'string',
                                        format: 'uuid',
                                        description: 'Optional role UUID (defaults to user role)',
                                        example: '123e4567-e89b-12d3-a456-426614174000'
                                    }
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User registered successfully',
                    },
                    400: {
                        description: 'Invalid input or registration failed',
                    }
                }
            }
        ),

        // Login user
        CustomRoutes.createRoute(
            'POST',
            '/api/auth/login',
            async ({ req, res }) => {
                try {
                    const { username, password } = req.body;
                    
                    if (!username || !password) {
                        return res.status(400).json({
                            success: false,
                            error: 'Missing credentials',
                            message: 'username and password are required'
                        });
                    }
                    
                    const result = await authService.login({ 
                        username, 
                        password,
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent']
                    });
                    
                    return {
                        success: true,
                        message: 'Login successful',
                        data: result
                    };
                } catch (error) {
                    return res.status(401).json({
                        success: false,
                        error: 'Login failed',
                        message: error.message
                    });
                }
            },
            {
                summary: 'Login user',
                description: 'Authenticate user with username and password, returns access and refresh tokens',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['username', 'password'],
                                properties: {
                                    username: { 
                                        type: 'string',
                                        description: 'Username or email',
                                        example: 'john_doe'
                                    },
                                    password: { 
                                        type: 'string',
                                        format: 'password',
                                        description: 'User password',
                                        example: 'securePassword123'
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful, returns tokens and user info',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Login successful' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user: { type: 'object' },
                                                accessToken: { type: 'string' },
                                                refreshToken: { type: 'string' },
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Invalid credentials',
                    }
                }
            }
        ),

        // Logout user
        CustomRoutes.createRoute(
            'POST',
            '/api/auth/logout',
            async ({ req, res }) => {
                try {
                    const token = req.headers.authorization?.replace('Bearer ', '');
                    
                    if (!token) {
                        return res.status(400).json({
                            success: false,
                            error: 'No token provided',
                            message: 'Authorization token is required'
                        });
                    }
                    
                    await authService.logout(token);
                    
                    return {
                        success: true,
                        message: 'Logged out successfully'
                    };
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        error: 'Logout failed',
                        message: error.message
                    });
                }
            },
            {
                summary: 'Logout user',
                description: 'Invalidate current access token and end session',
                tags: ['Authentication'],
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Logged out successfully',
                    },
                    400: {
                        description: 'Logout failed',
                    }
                }
            }
        ),

        // Refresh token
        CustomRoutes.createRoute(
            'POST',
            '/api/auth/refresh',
            async ({ req, res }) => {
                try {
                    const { refreshToken } = req.body;
                    
                    if (!refreshToken) {
                        return res.status(400).json({
                            success: false,
                            error: 'Missing refresh token',
                            message: 'refreshToken is required'
                        });
                    }
                    
                    const result = await authService.refreshToken(refreshToken);
                    
                    return {
                        success: true,
                        message: 'Token refreshed successfully',
                        data: result
                    };
                } catch (error) {
                    return res.status(401).json({
                        success: false,
                        error: 'Token refresh failed',
                        message: error.message
                    });
                }
            },
            {
                summary: 'Refresh access token',
                description: 'Get new access token using refresh token',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['refreshToken'],
                                properties: {
                                    refreshToken: { 
                                        type: 'string',
                                        description: 'Refresh token from login',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Token refreshed successfully',
                    },
                    401: {
                        description: 'Invalid or expired refresh token',
                    }
                }
            }
        ),

        // Get current user
        CustomRoutes.createRoute(
            'GET',
            '/api/auth/me',
            async ({ req, res }) => {
                try {
                    const token = req.headers.authorization?.replace('Bearer ', '');
                    
                    if (!token) {
                        return res.status(401).json({
                            success: false,
                            error: 'No token provided',
                            message: 'Authorization token is required'
                        });
                    }
                    
                    const user = await authService.getCurrentUser(token);
                    
                    if (!user) {
                        return res.status(401).json({
                            success: false,
                            error: 'Invalid token',
                            message: 'Token is invalid or expired'
                        });
                    }
                    
                    return {
                        success: true,
                        data: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                        }
                    };
                } catch (error) {
                    return res.status(401).json({
                        success: false,
                        error: 'Failed to get user',
                        message: error.message
                    });
                }
            },
            {
                summary: 'Get current user',
                description: 'Get current authenticated user information',
                tags: ['Authentication'],
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: 'User information retrieved successfully',
                    },
                    401: {
                        description: 'Not authenticated or invalid token',
                    }
                }
            }
        ),

        // Logout all sessions
        CustomRoutes.createRoute(
            'POST',
            '/api/auth/logout-all',
            async ({ req, res }) => {
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
                            error: 'Invalid token',
                            message: 'Token is invalid or expired'
                        });
                    }
                    
                    await authService.logoutAll(session.user.id);
                    
                    return {
                        success: true,
                        message: 'All sessions logged out successfully'
                    };
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        error: 'Logout all failed',
                        message: error.message
                    });
                }
            },
            {
                summary: 'Logout all sessions',
                description: 'Invalidate all access tokens for current user',
                tags: ['Authentication'],
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: 'All sessions logged out successfully',
                    },
                    401: {
                        description: 'Not authenticated',
                    }
                }
            }
        ),
    ];
};
