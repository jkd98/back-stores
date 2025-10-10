import { Model, DataTypes } from 'sequelize';
import db from '../config/db.js'


export class Movimiento extends Model { }

Movimiento.init(
    {
        id_movimiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        tipo: {
            type: DataTypes.ENUM('Entrada', 'Salida'),
            allowNull: false
        },
        id_producto: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        referencia: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        id_proveedor: { // Entrada
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_cliente: { // Salida
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize: db
    }
)