import { Model, DataTypes } from "sequelize";
import db from "../config/db.js";

export class Usuario extends Model { }


//TODO: Investigar si solo ocupo la clase para instanciar un objeto y guardarlo en la DB
Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
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
        lastN: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                is: {
                    args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, // solo letras
                    msg: 'Solo se admiten letras'
                },
                notNull: {
                    msg: 'Please enter your last name',
                },
                notEmpty: true,
            }
        },
        pass: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg:"Debe ser un email válido"
                },
                notNull: {
                    msg: 'Por favor, ingresa tu email',
                },
                notEmpty: true,
            }
        },
        telf: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                is:{
                    args:/^[0-9]*$/,
                    msg:'Solo se admiten números'
                },
                notEmpty: true,
            }
        },
        emailConfirm: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'editor', 'lector'),
            allowNull: false,
            defaultValue: 'lector'
        },
        lat: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        },
        lng: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        },
        logged: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false

        }
    },
    {
        sequelize: db,
        timestamps: true
    }
)