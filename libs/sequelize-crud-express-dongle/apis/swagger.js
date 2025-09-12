import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import expressListRoutes from 'express-list-routes';

export const initializeSwagger = ({
  app,
  models,
  packageJson,
}) => {
  
  // Define the Swagger options
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0', // Specify the version of OpenAPI
      info: {
        title: packageJson.title || packageJson.name || '',
        version: packageJson.version || '',
        description: packageJson.description || '',
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "localhost",
        }
      ],
    },
    apis: [], // Will be filled with API routes later
  };
  
  // Create the Swagger specification
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  
  
  // Sample API endpoints
  const apiEndpoints = [];
  
  // Generate Swagger paths
  const meta = app.meta;
  const paths = expressListRoutes(app, { logger: true });
  paths.forEach((endpoint) => {
    endpoint.path = endpoint.path.substring(2);
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
        responses: {
          200: {
            description: 'Successful response',
          },
          404: {
            description: 'Not found',
          },
        },
        ...meta[`${method} ${url}`],
      },
    };
  });
  
  // Add paths to Swagger documentation
  swaggerDocs.paths = { ...swaggerDocs.paths, ...paths };


  const schemaTypeMapping = {
    "uuid": "string",
    "varchar": "string",
    "timestamp": "string",
  }

  for (var k in models) {
    swaggerDocs.components = swaggerDocs.components || {};
    swaggerDocs.components.schemas = swaggerDocs.components.schemas || {};

    const schema = {
      type: 'object',
      properties: {},
    };

    for (var m in models[k].tableAttributes) {
      const attribute = models[k].tableAttributes[m];

      var type = attribute.type.__proto__.key.toLowerCase();
      var description = attribute.description || '';

      if (type === 'enum') {
        type = "string";
        description = `${description}<br/>${JSON.stringify(attribute.type.values)}`.trim();
      }

      var defaultValue = attribute.defaultValue?.toString() || "";
      var autoIncrement = attribute.autoIncrement;
      var primaryKey = attribute.primaryKey;

      if (autoIncrement) {
        continue;
      }

      if (primaryKey && defaultValue) {
        continue;
      }

      if (type.indexOf("timestamp") === 0) {
        if (defaultValue) {
          continue;
        }
      }

      for (var key in schemaTypeMapping) {
        if (type.indexOf(key) === 0) {
          type = schemaTypeMapping[key];
        }
      }

      schema.properties[m] = {
        type,
        default: defaultValue,
        description,
      };
    }

    swaggerDocs.components.schemas[k] = schema;


    swaggerDocs.components.headers = {
      accesstoken: {
        description: "Access token for authorization",
        type: "string",
      },
    }

    swaggerDocs.security = {
      accesstoken: [],
    }
  }

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  
  // Serve swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
  
  console.log("Swagger URL: /api-docs");
  console.log("Swagger JSON URL: /swagger.json");
  
}



