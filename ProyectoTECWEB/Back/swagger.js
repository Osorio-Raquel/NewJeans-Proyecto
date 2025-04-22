import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Usuarios y Documentos',
      version: '1.0.0',
      description: 'API para la gestión de usuarios y documentos en el sistema MIGA',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [], // Aplica la autenticación con Bearer Token a todas las rutas por defecto
    }],
  },
  apis: ['./routes/*.js'], // Ruta donde se encuentran los archivos con los comentarios de JSDoc para Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
