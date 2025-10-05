import express from 'express';

/**
 * Authentication Routes
 * Provides login, register, logout endpoints
 */
export class AuthRoutes {
    constructor(userAuthService, authMiddleware) {
        this.userAuthService = userAuthService;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // Register new user
        this.router.post('/register', async (req, res) => {
            try {
                const { username, email, password, firstName, lastName, userRoleId } = req.body;

                if (!username || !email || !password) {
                    return res.status(400).json({
                        error: 'Username, email, and password are required'
                    });
                }

                const user = await this.userAuthService.register({
                    username,
                    email,
                    password,
                    firstName,
                    lastName,
                    userRoleId,
                });

                // Remove sensitive data
                const { ...userData } = user.toJSON();

                res.status(201).json({
                    success: true,
                    user: userData,
                });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        // Login
        this.router.post('/login', async (req, res) => {
            try {
                const { login, password } = req.body;

                if (!login || !password) {
                    return res.status(400).json({
                        error: 'Login and password are required'
                    });
                }

                const result = await this.userAuthService.login({
                    login,
                    password,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });

                // Remove sensitive data
                const { ...userData } = result.user.toJSON();

                res.json({
                    success: true,
                    user: userData,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    expiresAt: result.expiresAt,
                });
            } catch (error) {
                res.status(401).json({ error: error.message });
            }
        });

        // Refresh token
        this.router.post('/refresh', async (req, res) => {
            try {
                const { refreshToken } = req.body;

                if (!refreshToken) {
                    return res.status(400).json({
                        error: 'Refresh token is required'
                    });
                }

                const result = await this.userAuthService.refreshToken(
                    refreshToken,
                    req.ip,
                    req.headers['user-agent']
                );

                // Remove sensitive data
                const { ...userData } = result.user.toJSON();

                res.json({
                    success: true,
                    user: userData,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    expiresAt: result.expiresAt,
                });
            } catch (error) {
                res.status(401).json({ error: error.message });
            }
        });

        // Logout
        this.router.post('/logout', this.authMiddleware.authenticate(), async (req, res) => {
            try {
                const authHeader = req.headers.authorization;
                const token = authHeader.startsWith('Bearer ')
                    ? authHeader.substring(7)
                    : authHeader;

                await this.userAuthService.logout(token);

                res.json({ success: true, message: 'Logged out successfully' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Logout all sessions
        this.router.post('/logout-all', this.authMiddleware.authenticate(), async (req, res) => {
            try {
                await this.userAuthService.logoutAll(req.user.id);

                res.json({ success: true, message: 'All sessions logged out successfully' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get current user
        this.router.get('/me', this.authMiddleware.authenticate(), async (req, res) => {
            try {
                const { ...userData } = req.user.toJSON();

                res.json({
                    success: true,
                    user: userData,
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Change password
        this.router.post('/change-password', this.authMiddleware.authenticate(), async (req, res) => {
            try {
                const { oldPassword, newPassword } = req.body;

                if (!oldPassword || !newPassword) {
                    return res.status(400).json({
                        error: 'Old password and new password are required'
                    });
                }

                await this.userAuthService.changePassword(
                    req.user.id,
                    oldPassword,
                    newPassword
                );

                res.json({ success: true, message: 'Password changed successfully' });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        // Verify token (health check)
        this.router.get('/verify', this.authMiddleware.authenticate(), async (req, res) => {
            res.json({
                success: true,
                message: 'Token is valid',
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email,
                    role: req.userRole?.code,
                }
            });
        });
    }

    getRouter() {
        return this.router;
    }
}
