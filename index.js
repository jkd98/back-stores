//  +++++++++++ Librerias ++++++++++++++++
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"; // permitir coneiones desde el domini del front
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './config/swagger-output.json' with { type: 'json' };

//  +++++++++++ Modulos ++++++++++++++++
import db from "./config/db.js";

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
export async function connectDB() {
    try {
        await db.authenticate()
        await db.sync() // para poder agregar nuevas columnas
        console.log("Conexión exitosa a DB"); //--Se comenta para evitar warnings en las pruebas
    } catch (error) {
        console.log(error);
        console.log("error al conectarse a DB")
    }
}
connectDB();

// Configurar CORS

// Dominios Permitidos
const whiteList = [
    process.env.E_FRONT, process.env.TEST_BACK
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


// Rutas
//http://tu-servidor.com/uploads/nombreArchivo.jpg
app.use('/public/uploads', express.static('public/uploads')); // 'uploads' es la carpeta donde guardas las imágenes
app.use('/auth', usuarioRoutes);


// Servir documentación generada por swagger-autogen
const swaggerUiOptions = {
    customSiteTitle: 'Documentación REST API Express'
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput, swaggerUiOptions));




// Iniciando el servidor
app.listen(port, () => {
    // http://localhost:3050/
    console.log(`Server is running on http://localhost:${port}`);
});
