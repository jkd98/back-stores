import swaggerJSDoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Auth',
                description: 'API operations related to auth'
            }
        ],
        info: {
            title: 'Rest API Node.js / Express ',
            version: "1.0.0",
            description: "API Docs for Store"
        }
    },
    apis:['./routes/usuarioRoutes.js']
}

const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiOptions = {
    customSiteTitle: 'Documentación REST API Express'
}

export default swaggerSpec;