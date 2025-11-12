import express from 'express';
import { RouterWithMeta, modelRegistry, CustomRoutes } from 'sequelize-rest-framework';
import { healthRoutes } from './custom-routes/health.js';
import { createAuthRoutes } from './custom-routes/auth.js';
import { createAuthMiddleware } from '../middleware/auth.js';

export const Router = {
    initialize: async ({ app, models, authSystem }) => {
        const router = express.Router()
        const meta = {}
        const routerWithMeta = RouterWithMeta({ router, meta });

        // Create auth middleware and make available globally
        const authMiddleware = createAuthMiddleware(models);
        router.authMiddleware = authMiddleware; // Expose for use in routes
        app.authMiddleware = authMiddleware; // Also expose on app

        // Mount library auth routes (deprecated - use custom auth routes instead)
        if (authSystem) {
            router.use('/api/auth-legacy', authSystem.getAuthRoutes());
        }

        // Initialize all auto-registered models
        await modelRegistry.initializeAll({
            app: router,
            appWithMeta: routerWithMeta
        });

        // Register custom routes
        const authRoutes = createAuthRoutes(models);
        const customRoutes = [
            ...healthRoutes,
            ...authRoutes,
        ];

        CustomRoutes.registerGeneral(routerWithMeta, customRoutes);

        app.meta = meta;

        return router;
    },
}
