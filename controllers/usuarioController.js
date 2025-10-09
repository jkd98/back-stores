import bcrypt from "bcrypt";
import { Op } from "sequelize";

import { emailRegistro, emailCodigoVerificacion, emailOlvidePass } from "../helpers/email.js"
import { generateSixDigitToken } from "../helpers/genSixDigitToken.js";
import { generarJWT } from '../helpers/generarJWT.js'

import { tokenTypes } from "../models/Token.js";
import { Usuario, Token, Respuesta } from "../models/index.js";

import { crearLog, obtenerIP } from "../helpers/crearLog.js";
import { NivelesLog } from "../helpers/crearLog.js";
import { getLocation } from "../helpers/getLocation.js";

// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    const { name, lastN, email, pass, telf } = req.body;

    try {
        // Verificar si el email ya está registrado
        const existeUsuario = await Usuario.findOne({ where: { email } });

        if (existeUsuario) {
            respuesta.status = 'error';
            respuesta.msg = 'El email ya está registrado';
            return res.status(400).json(respuesta);
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        //Generar y guardar usuario
        const nwUser = await Usuario.create({
            name,
            lastN,
            email,
            pass: hashedPassword,
            telf
        });

        console.log("Preregistro:\n", nwUser);

        // Generar token
        const nwToken = await Token.create({
            userId: nwUser.id,
            code: generateSixDigitToken(),
            expiresAt: Date.now() + 5 * 60 * 1000,  // -> 300,000 milisegundos (5 minutos)
            typeCode: tokenTypes.ACCOUNT_CONFIRMATION
        })


        //TODO: Activar el envio de emails
        emailRegistro({ email, name, token: nwToken.code });

        respuesta.status = 'success';
        respuesta.msg = 'Registro completado, confirma tu cuenta para activarla';
        respuesta.data = null;
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al registrar el usuario';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
};

// Funcion para confirmar la cuenta de un usuario
const confirmarCuenta = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    const { token } = req.body;
    try {
        // new Date() => hora en UTC igual que en mongo 
        const isValidToken = await Token.findOne({
            where: {
                code: token,
                expiresAt: { [Op.gte]: new Date() },
                typeCode: tokenTypes.ACCOUNT_CONFIRMATION
            }
        }
        );
        if (!isValidToken) {
            respuesta.status = 'error';
            respuesta.msg = 'El token no es válido o ya expiró';
            return res.status(404).json(respuesta);
        }

        const userExists = await Usuario.findByPk(isValidToken.userId);

        //Verificar si no ha confirmado la cuenta
        if (userExists.emailConfirm) {
            respuesta.status = 'error';
            respuesta.msg = 'Esta cuenta ya ha sido confirmada';
            return res.status(400).json(respuesta);
        }

        userExists.emailConfirm = true;

        await Promise.allSettled([userExists.save(), isValidToken.destroy()]);

        respuesta.status = 'success';
        respuesta.msg = 'Cuenta confirmada, ya puedes iniciar sesión';
        respuesta.data = null;
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al confirmar la cuenta';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

// Funcion que vuelve a generar un token para confirmar la cuenta
const generarTokenConfirm = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();

    try {
        const { email } = req.body;
        // Verificar si el email ya está registrado
        const existeUsuario = await Usuario.findOne({ where: { email } });
        if (!existeUsuario) {
            respuesta.status = 'error';
            respuesta.msg = 'El usuario no esta registrado';
            return res.status(400).json(respuesta);
        }

        //Verificar si no ha confirmado la cuenta
        if (existeUsuario.emailConfirm) {
            respuesta.status = 'error';
            respuesta.msg = 'Esta cuenta ya ha sido confirmada';
            return res.status(400).json(respuesta);
        }


        // Generar token
        const nwToken = await Token.create({
            userId: existeUsuario.id,
            code: generateSixDigitToken(),
            expiresAt: Date.now() + 5 * 60 * 1000,  // -> 300,000 milisegundos (5 minutos)
            typeCode: tokenTypes.ACCOUNT_CONFIRMATION
        })

        // TODO: Habilitar el envio de emails
        emailRegistro({ email, name: existeUsuario.name, token: nwToken.code });

        respuesta.status = 'success';
        respuesta.msg = 'Nuevo token enviado al email';
        respuesta.data = null;
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al generar el token';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

// Funcion que al ingresar email y pass genera el token de 2FA
const login = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    const { email, pass } = req.body;

    try {
        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
            respuesta.status = 'error';
            respuesta.msg = 'El usuario no existe';
            return res.status(404).json(respuesta);
        }

        const passCorrecto = await bcrypt.compare(pass, user.pass);
        if (!passCorrecto) {
            respuesta.status = 'error';
            respuesta.msg = 'Password incorrecto';
            return res.status(404).json(respuesta);
        }

        if (user.logged) {
            respuesta.status = 'error';
            respuesta.msg = 'Ya tienes una sesión activa';
            return res.status(404).json(respuesta);
        }

        if (!user.emailConfirm) {
            // Generar token
            const nwToken = await Token.create({
                userId: existeUsuario.id,
                code: generateSixDigitToken(),
                expiresAt: Date.now() + 5 * 60 * 1000,  // -> 300,000 milisegundos (5 minutos)
                typeCode: tokenTypes.ACCOUNT_CONFIRMATION
            })

            emailRegistro({ email, name: user.name, token: nwToken.code });
            respuesta.status = 'error';
            respuesta.msg = 'La cuenta no ha sido confirmada. Se ha enviado un codigo de confirmación a tu email';
            return res.status(404).json(respuesta);
        }

        // Generar código 2FA
        const twoFactorCode = Token.build({
            userId: user.id,
            code: generateSixDigitToken(),
            expiresAt: Date.now() + 5 * 60 * 1000,  // -> 300,000 milisegundos (5 minutos)
            typeCode: tokenTypes.TWO_FACTOR
        })

        await emailCodigoVerificacion({ name: user.name, email: user.email, code: twoFactorCode.code })

        await twoFactorCode.save();

        respuesta.status = 'success';
        respuesta.msg = 'Token 2FA enviado a correo';
        respuesta.data = user.id;
        return res.status(200).json(respuesta);

    } catch (error) {
        //console.log(error);
        if (error.isEmailError) {
            console.log('hola, sin conexión');
            const user = await Usuario.findOne({ where: { email } });

            if (user.logged) {
                respuesta.status = 'error';
                respuesta.msg = 'Ya tienes una sesión activa';
                return res.status(404).json(respuesta);
            }
            // Generar código 2FA
            const twoFactorCode = await Token.create({
                userId: user.id,
                code: generateSixDigitToken(),
                expiresAt: Date.now() + 5 * 60 * 1000,  // -> 300,000 milisegundos (5 minutos)
                typeCode: tokenTypes.TWO_FACTOR
            })

            res.json({ code: user.id + ' Your code is: ' + twoFactorCode.code })
        } else {
            respuesta.status = 'error';
            respuesta.msg = 'Error al iniciar sesión';
            respuesta.data = error.message;
            return res.status(500).json(respuesta);
        }
    }
}

// Funcion que valida el token para autenticación 2FA
const verify2FA = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta()
    const { code, userId } = req.body;
    try {
        const validCode = await Token.findOne({
            where: {
                userId,
                code,
                expiresAt: { [Op.gte]: new Date() },
                used: false,
                typeCode: tokenTypes.TWO_FACTOR
            }
        })

        const user = await Usuario.findByPk(userId);

        if (!validCode) {
            await crearLog({
                level: NivelesLog.ERROR,
                msg: `El codigo ingresado no es válido`,
                userEmail: user.email,
                path: req.originalUrl,
                ip: obtenerIP(req)
            })
            respuesta.status = 'error';
            respuesta.msg = 'El código no es correcto o ya expiró';
            return res.status(404).json(respuesta);
        }
        //
        if (user.logged) {
            respuesta.status = 'error';
            respuesta.msg = 'Ya tienes una sesión activa';
            return res.status(404).json(respuesta);
        }

        //TODO:Guardar ubicación
        const location = await getLocation();

        user.logged = true;

        await validCode.destroy()

        //  generar JWT
        const tkn = generarJWT({ userId });

        console.log(location, user.lat)
        if (user.lat.toString() === location.location.lat.toString() && user.lng.toString() === location.location.lng.toString()) {
            await user.save()
            respuesta.status = 'success';
            respuesta.msg = 'Autenticación exitosa';
            respuesta.data = tkn;
            return res.status(200).json(respuesta);
        } else {
            user.lat = location.location.lat;
            user.lng = location.location.lng;
            await user.save()
            respuesta.status = 'success';
            respuesta.msg = 'Has accedido desde una ubicación diferente';
            respuesta.data = tkn;
            return res.status(200).json(respuesta);
        }


    } catch (error) {
        console.log(error)
        if (error.message === 'fetch failed') {
            console.log("Error en la API google");
            const tkn = generarJWT({ userId });

            const user = await Usuario.findByPk(userId);

            user.logged = true;

            const validCode = await Token.findOne({
                where: {
                    userId,
                    code,
                    expiresAt: { [Op.gte]: new Date() },
                    used: false,
                    typeCode: tokenTypes.TWO_FACTOR
                }
            });

            await Promise.allSettled([user.save(), validCode.destroy()])

            respuesta.status = 'success';
            respuesta.msg = 'Autenticación exitosa';
            respuesta.data = tkn;
            return res.status(200).json(respuesta);
        } else {
            respuesta.status = 'error';
            respuesta.msg = 'Error al iniciar sesión';
            respuesta.data = error.message;
            return res.status(500).json(respuesta);
        }
    }

}

// Funcion para cerrar sesion
const logOut = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    const { email } = req.body;
    try {
        const existsUser = await Usuario.findOne({ where: { email } });
        console.log(existsUser)

        if (!existsUser) {
            respuesta.status = 'error';
            respuesta.msg = 'El usuario no existe';
            return res.status(404).json(respuesta);
        }

        existsUser.logged = false;

        await existsUser.save()
        respuesta.status = 'success';
        respuesta.msg = 'Se ha cerrado la sesión';
        return res.status(200).json(respuesta);


    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al cerrar sesión';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

// Funcion que genera un token para cambiar pass
const tokenResetPassword = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    try {
        const { email } = req.body;
        const existsUser = await Usuario.findOne({ where: { email } });

        if (!existsUser) {
            respuesta.status = 'error';
            respuesta.msg = 'El usuario no existe';
            return res.status(404).json(respuesta);
        }

        //  Generar token
        const nwToken = Token.build({
            userId: existsUser.id,
            code: generateSixDigitToken(),
            expiresAt: Date.now() + 5 * 60 * 1000,  // -> 300,000 milisegundos (5 minutos)
            used: false,
            typeCode: tokenTypes.PASSWORD_RESET

        })

        //TODO:Activar el envio de emails
        //  Enviar email con token
        emailOlvidePass({ email, name: existsUser.name, token: nwToken.code });

        await nwToken.save()
        respuesta.status = 'success';
        respuesta.msg = 'Se ha enviado un email con las instrucciones';
        return res.status(200).json(respuesta);


    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al generar el token';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

// Funcion que comprueba la validez del token de reset pass
const confirmarTokenReset = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    try {
        const { token } = req.body;
        const isValidToken = await Token.findOne({ where: { code: token, typeCode: tokenTypes.PASSWORD_RESET } });
        if (!isValidToken) {
            respuesta.status = 'error';
            respuesta.msg = 'El token no es válido o ya fue utilizado';
            return res.status(400).json(respuesta);
        }

        if (isValidToken.expiresAt.getTime() <= Date.now()) {
            respuesta.status = 'error';
            respuesta.msg = 'El token ya expiró';
            return res.status(400).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Token válido';
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al verficar el token';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

// Función para cambiar la contraseña del usuario
const resetPassword = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    try {
        const { pass, token } = req.body;

        const isValidToken = await Token.findOne({ where: { code: token, typeCode: tokenTypes.PASSWORD_RESET } });

        if (!isValidToken) {
            respuesta.status = 'error';
            respuesta.msg = 'El token no es válido o ya fue utilizado';
            return res.status(400).json(respuesta);
        }

        if (isValidToken.expiresAt.getTime() <= Date.now()) {
            respuesta.status = 'error';
            respuesta.msg = 'El token ya expiró';
            return res.status(400).json(respuesta);
        }

        const isValidUser = await Usuario.findByPk(isValidToken.userId);


        //  Nueva password
        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        isValidUser.pass = hashedPassword;

        await Promise.allSettled([isValidUser.save(), isValidToken.destroy()]);


        respuesta.status = 'success';
        respuesta.msg = 'Nuevo password guardado correctamente';
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al cambiar el password';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

export {
    registrarUsuario,
    confirmarCuenta,
    login,
    verify2FA,
    tokenResetPassword,
    confirmarTokenReset,
    resetPassword,
    generarTokenConfirm,
    logOut
}