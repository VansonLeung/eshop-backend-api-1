import express from 'express';
import bodyParser from 'body-parser';
import { Router } from './router.js';

export const initializeAPIs = ({
    models,
}) => 
{
    const app = express();
    
    // Middleware to parse JSON requests
    app.use(express.static('public'))
    app.use(bodyParser.json());
    app.use(Router.initialize({ app, models }));
    
    return app;
}

