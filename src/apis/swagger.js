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
  
  
  // Generate Swagger paths from metadata
  const meta = app.meta || {};
  const routes = expressListRoutes(app, { logger: true });
  console.log(`Total API count: ${routes.length}`)

  const swaggerPaths = {};

  routes.forEach((route) => {
    const path = route.path.substring(2); // Remove /~ prefix
    const method = route.method.toLowerCase();
    const metaKey = `${route.method} ${path}`;

    // Extract model name from path for grouping
    // e.g., /api/User, /api/User/:id, /api/auth/login
    const pathParts = path.split('/');
    let tag = 'Other';
    if (pathParts[1] === 'api' && pathParts[2]) {
      tag = pathParts[2].split(':')[0].split('?')[0]; // Remove :id or query params
    } else if (pathParts[1] === 'api') {
      tag = 'API';
    }

    // Initialize path object if it doesn't exist
    if (!swaggerPaths[path]) {
      swaggerPaths[path] = {};
    }

    // Add method with metadata from appWithMeta
    swaggerPaths[path][method] = {
      summary: `${route.method} ${path}`,
      tags: [tag],
      responses: {
        200: {
          description: 'Successful response',
        },
        404: {
          description: 'Not found',
        },
      },
      ...meta[metaKey], // Merge metadata from RouterWithMeta
    };
  });

  // Add paths to Swagger documentation
  swaggerDocs.paths = { ...swaggerDocs.paths, ...swaggerPaths };

  // Generate tags from registered models for grouping
  swaggerDocs.tags = swaggerDocs.tags || [];
  const uniqueTags = new Set();

  // Collect all unique tags from paths
  Object.values(swaggerPaths).forEach(pathObj => {
    Object.values(pathObj).forEach(methodObj => {
      if (methodObj.tags) {
        methodObj.tags.forEach(tag => uniqueTags.add(tag));
      }
    });
  });

  // Add tag descriptions
  uniqueTags.forEach(tag => {
    swaggerDocs.tags.push({
      name: tag,
      description: `Endpoints for ${tag} operations`
    });
  });


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



