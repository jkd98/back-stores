import { Model, DataTypes } from "sequelize";
import db from "../config/db.js";
import { generarId } from "../helpers/generarId.js";


export const tokenTypes = {
    PASSWORD_RESET: "password_reset",
    ACCOUNT_CONFIRMATION: "account_confirmation",
    TWO_FACTOR: "two_factor",
};


export class Token extends Model { }


Token.init(
    {
        UUID: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            defaultValue: () => generarId()
        },
        userId: {   //  fk
            type: DataTypes.INTEGER,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(7),
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        typeCode: {
            type: DataTypes.ENUM(
                tokenTypes.PASSWORD_RESET,
                tokenTypes.ACCOUNT_CONFIRMATION,
                tokenTypes.TWO_FACTOR
            ),
            allowNull: false,
        },
    },
    {
        sequelize: db,
        timestamps: true
    }
)
