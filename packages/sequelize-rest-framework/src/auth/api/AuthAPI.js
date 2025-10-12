import { UserAuthService } from '../services/UserAuthService.js';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';

export class AuthAPI {
    static initialize({
        app,
        appWithMeta,
        models,
    }) {
        // Login route
        appWithMeta.post(`/api/auth/login`, {}, async (req, res) => {
            try {
                const { username, password } = req.body;
                const { user, session } = await UserAuthService.loginUser({ models, username, password });
                res.sendResponse({ status: 200, data: { user, session } });
            } catch (error) {
                res.sendError({ error });
                throw error;
            }
        });

        // Logout route
        appWithMeta.post(`/api/auth/logout`, {},

            AuthMiddleware.applyACL({
                models,
                apiName: `auth`,
                requiredPermission: `logout`,
            }),

            async (req, res) => {
                try {
                    const result = await UserAuthService.logoutUser({ models, sessionId: req.session.id });
                    res.sendResponse({ status: 200, data: result });
                } catch (error) {
                    res.sendError({ error });
                    throw error;
                }
            },
        );

        // Register route
        appWithMeta.post(`/api/auth/register`, {}, async (req, res) => {
            try {
                const user = req.body;
                const { user: newUser, session } = await UserAuthService.registerUser({ models, user });
                res.sendResponse({ status: 200, data: { user: newUser, session } });
            } catch (error) {
                res.sendError({ error });
                throw error;
            }
        });

        // Refresh token route
        appWithMeta.post(`/api/auth/refresh`, {}, async (req, res) => {
            try {
                const { refreshToken } = req.body;
                const tokens = await UserAuthService.refreshSession({ models, refreshToken });
                res.sendResponse({ status: 200, data: tokens });
            } catch (error) {
                res.sendError({ error });
                throw error;
            }
        });
    }
}