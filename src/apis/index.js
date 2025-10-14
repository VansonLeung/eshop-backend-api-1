import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Router } from './router.js';
import { RequestResponseMiddleware } from 'sequelize-rest-framework';

export const initializeAPIs = async ({
    models,
    authSystem,
}) =>
{
    const app = express();
    app.use(cors());

    // Middleware to parse JSON requests
    app.use(express.static('public'))
    app.use(bodyParser.json());
    app.use(RequestResponseMiddleware.apply());

    const router = await Router.initialize({ app, models, authSystem });
    app.use(router);

    return app;
}

