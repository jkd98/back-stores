import db from "../config/db.js";
import { Model, DataTypes } from "sequelize";

export class Log extends Model { }

const levels = ['info', 'warn', 'error']

Log.init(
    {
        level: {
            type: DataTypes.ENUM(levels),
            allowNull: false
        },
        msg: { 
            type: DataTypes.STRING(150), 
            allowNull:false
        },
        userEmail: { 
            type: DataTypes.STRING(150),
            allowNull:false 
        },
        path: { 
            type: DataTypes.STRING(100)
        }, // opcional: la ruta donde ocurrió
        ip: { 
            type: DataTypes.STRING 
        },
        date: { 
            type: DataTypes.DATE, 
            defaultValue: new Date()
        }
    },
    {
        sequelize:db
    }
);