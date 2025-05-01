import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import expressListRoutes from 'express-list-routes';

export const initializeSwagger = ({
  app,
}) => {
  
  // Define the Swagger options
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0', // Specify the version of OpenAPI
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for my application',
      },
    },
    apis: [], // Will be filled with API routes later
  };
  
  // Create the Swagger specification
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  
  
  // Sample API endpoints
  const apiEndpoints = [];
  
  // Generate Swagger paths
  const paths = expressListRoutes(app, { logger: true });
  paths.forEach((endpoint) => {
    apiEndpoints.push({
      url: endpoint.path,
      method: endpoint.method,
    });
  });
  console.log(`Total API count: ${paths.length}`)
  
  apiEndpoints.forEach((endpoint) => {
    const { url, method, description } = endpoint;
    paths[url] = {
      ...paths[url],
      [method.toLowerCase()]: {
        summary: description,
        parameters: method === 'GET' ? [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }] : [],
        responses: {
          200: {
            description: 'Successful response',
          },
          404: {
            description: 'Not found',
          },
        },
      },
    };
  });
  
  // Add paths to Swagger documentation
  swaggerDocs.paths = { ...swaggerDocs.paths, ...paths };
  
  
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  
  console.log("Swagger URL: /api-docs");
  
}



