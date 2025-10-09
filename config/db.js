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
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    //models: [Product],
    logging: false //--para evitar warnings en las pruebas por console logs
})


export default db;