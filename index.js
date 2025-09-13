//  +++++++++++ Librerias ++++++++++++++++
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"; // permitir coneiones desde el domini del front
import swaggerUi from 'swagger-ui-express';

import swaggerSpec, { swaggerUiOptions } from './config/swagger.js';


//  +++++++++++ Modulos ++++++++++++++++
import conectarDB from "./config/db.js";
import { sanitizeObject } from './middleware/sanitiza.js';

//  +++++++++++ Routes +++++++++++++++++
import usuarioRoutes from './routes/usuarioRoutes.js';


// Esto va a buscar por un archivo .env
dotenv.config();

// Crear la app const app = express();
const app = express();

app.use(express.json()); // para que procese informacion json correctamente

// Puerto 
const port = process.env.PORT || 3000;

// conectar a la base de datos
conectarDB();

// Configurar CORS

// Dominios Permitidos
const whiteList = [
    process.env.E_FRONT
];

const corsOptions = {
    origin: function (origin, callback) {
        // Comprobar en la lista blanca
        if (!origin || whiteList.includes(origin)) {
            // Puede consultar la API
            callback(null, true);
        } else {
            // No esta permitido
            callback(new Error("Error de CORS"));
        };
    },
    credentials: true
};

//Aplicando CORS
app.use(cors(corsOptions));

// Middleware de sanitización
app.use((req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
    next();
});

// Rutas
//http://tu-servidor.com/uploads/nombreArchivo.jpg
app.use('/public/uploads', express.static('public/uploads')); // 'uploads' es la carpeta donde guardas las imágenes
app.use('/auth', usuarioRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));


// Iniciando el servidor
app.listen(port, () => {
    // http://localhost:3050/
    console.log(`Server is running on http://localhost:${port}`);
});