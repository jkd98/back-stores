import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
dotenv.config();

const doc = {
  // Nota: no pongas aquí 'openapi' para evitar que swagger-autogen duplique 'swagger' y 'openapi'
  info: {
    title: 'Rest API Node.js / Express',
    description: 'API Docs for Store',
    version: '1.0.0'
  },
  tags: [
    { name: 'Auth', description: 'API operations related to auth' }
  ],
  servers: [
    { url: `http://localhost:${process.env.PORT}` }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const outputFile = './config/swagger-output.json';
// Escanear el archivo de entrada principal y todas las rutas de forma recursiva
const endpointsFiles = ['./index.js'];

// Opciones: forzar salida en OpenAPI 3 y habilitar inferencias
const options = { openapi: '3.0.0', language: 'es-ES', autoHeaders: true, autoQuery: true, autoBody: true, autoTag:true };


// Ejecuta generador
swaggerAutogen(options)(outputFile, endpointsFiles, doc)
