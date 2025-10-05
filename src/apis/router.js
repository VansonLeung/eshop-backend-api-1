import express from 'express';
import { RouterWithMeta, modelRegistry } from 'sequelize-rest-framework';

export const Router = {
    initialize: async ({ app, models, authSystem }) => {
        const router = express.Router()
        const meta = {}
        const routerWithMeta = RouterWithMeta({ router, meta });

        // Mount library auth routes
        if (authSystem) {
            router.use('/api/auth', authSystem.getAuthRoutes());
        }

        // Initialize all auto-registered models
        await modelRegistry.initializeAll({
            app: router,
            appWithMeta: routerWithMeta
        });

        app.meta = meta;

        return router;
    },
}
