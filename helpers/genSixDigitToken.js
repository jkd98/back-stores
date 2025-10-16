import { Producto } from "../models/index.js";

export const generateSixDigitToken = () => Math.floor(100000 + Math.random() * 900000).toString();
export const generateTenDigitCode = async () => {
    let isUnique = false;
    let code = '';
    while (!isUnique) {
        code = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const codeExists = await Producto.findOne({ where: { codigo: code } })
        if (!codeExists) {
            isUnique = true;
        }
    }

    return code
};