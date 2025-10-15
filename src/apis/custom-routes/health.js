import { CustomRoutes } from 'sequelize-rest-framework';

export const healthRoutes = [
    CustomRoutes.createRoute(
        'GET',
        '/api/custom/health',
        async ({ req, res }) => {
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development'
            };
        },
        {
            summary: 'Custom health check endpoint',
            description: 'Returns the health status of the application with additional metadata',
            responses: {
                200: {
                    description: 'Application is healthy',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'healthy' },
                                    timestamp: { type: 'string', format: 'date-time' },
                                    uptime: { type: 'number', description: 'Process uptime in seconds' },
                                    version: { type: 'string', example: '1.0.0' },
                                    environment: { type: 'string', example: 'development' }
                                }
                            }
                        }
                    }
                }
            }
        }
    )
];