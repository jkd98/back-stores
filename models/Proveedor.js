import { Model, DataTypes } from 'sequelize';
import db from '../config/db.js'


export class Proveedor extends Model { }

Proveedor.init(
    {
        id_proveedor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                is: {
                    args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, // solo letras
                    msg: 'Solo se admiten letras'
                },
                notNull: {
                    msg: 'Please enter your name',
                },
                notEmpty: true,
            }
        },
        telf: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                is: {
                    args: /^[0-9]*$/,
                    msg: 'Solo se admiten números'
                },
                notEmpty: true,
            }
        },
        contacto: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        disable: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        }

    },
    {
        sequelize: db
    }
)