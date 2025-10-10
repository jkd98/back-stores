import { Model, DataTypes } from 'sequelize';
import db from '../config/db.js'


export class Cliente extends Model { }

Cliente.init(
    {
        id_cliente: {
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
        }
    },
    {
        sequelize: db
    }
)