import { Model, DataTypes } from 'sequelize';
import db from '../config/db.js'


export class Producto extends Model { }

Producto.init(
    {
        id_producto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codigo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,

        },
        nombre: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descip: {
            type: DataTypes.STRING(400),
            allowNull: false,
        },
        categoria: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        unidad: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        stock_minimo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 10,
                max:1000
            }
        },
        stock_actual: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0,
            validate: {
                min: 0
            }
        },
        id_proveedor: { // fk
            type: DataTypes.INTEGER,
            allowNull: true
        },


    },
    {
        sequelize: db
    }
)