import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
//import { Product } from '../models/Product.model';


dotenv.config()
/*
dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
*/
const db = new Sequelize({
    database: process.env.DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    timezone: '+00:00', // UTC
    dialectOptions: {
        useUT: true
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    //models: [Product],
    logging: false, //--para evitar warnings en las pruebas por console logs
    pool: {
        max: 10,           // según tu BD
        min: 2,           // conexiones mínimas siempre listas
        acquire: 30000,   // 30s timeout, para obtener una conexión del pool
        idle: 10000       // cierra conexiones inactivas después de 10s
    }
})

/**
 * Función para conectar a la base de datos 
 */
export async function connectDB() {
    try {
        await db.authenticate()
        await db.sync() // para poder agregar nuevas columnas
        //console.log("Conexión exitosa a DB"); //--Se comenta para evitar warnings en las pruebas
    } catch (error) {
        console.log(error);
        //console.log("error al conectarse a DB")
    }
}


export default db;