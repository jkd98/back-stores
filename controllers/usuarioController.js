import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import Usuario from "../models/Usuario.js";
import PreRegistro from "../models/PreRegistro.js";
import { generarId, generarJWT, generarCode2fA } from "../helpers/generarId.js";
import { emailRegistro, emailCodigoVerificacion, emailOlvidePass } from "../helpers/email.js"
import TwoFactorCode from "../models/TwoFactorCode.js";

import { Respuesta } from "../models/Respuesta.js";

// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    // #swagger.tags = ['Auth']
    let respuesta = new Respuesta();

    try {
        const { name, lastN, email, pass } = req.body;
        console.log(req.body);
        // Verificar si el email ya está registrado
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            respuesta.status = 'error';
            respuesta.msg = 'El email ya está registrado';
            return res.status(400).json(respuesta);
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        const preregistro = new PreRegistro({
            name,
            lastN,
            email,
            pass: hashedPassword,
            token: generarId()
        });

        console.log("Preregistro:\n", preregistro);


        preregistro.save()
        emailRegistro({ email, name, token: preregistro.token });

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

const confirmarCuenta = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    const { token } = req.body;
    console.log(token)
    try {
        const preregistro = await PreRegistro.findOne({ token });
        if (!preregistro) {
            respuesta.status = 'error';
            respuesta.msg = 'El token no es válido o ya fue utilizado';
            return res.status(404).json(respuesta);
        }
        console.log(preregistro);

        const { name, lastN, email, pass, createdAt } = preregistro;

        const nwUSer = new Usuario({ name, lastN, email, pass, createdAt });
        console.log(nwUSer);
        await nwUSer.save();
        await PreRegistro.deleteOne({ token });

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

const login = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();

    try {
        const { email, pass } = req.body;
        const user = await Usuario.findOne({ email });
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

        // Generar código 2FA
        const twoFactorCode = new TwoFactorCode({
            userId: user._id,
            code: generarCode2fA(),
            expiresAt: Date.now() + 5 * 60 * 1000,  // -> 300,000 milisegundos (5 minutos)
            ipAddress: req.ip,
            used: false
        })

        emailCodigoVerificacion({ name: user.name, email: user.email, code: twoFactorCode.code })

        await twoFactorCode.save();

        respuesta.status = 'success';
        respuesta.msg = 'Token 2FA enviado a correo';
        respuesta.data = user._id;
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al iniciar sesión';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
}

const verify2FA = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta()
    try {
        const { userId, code } = req.body;

        const validCode = await TwoFactorCode.findOne({
            userId,
            code,
            expiresAt: { $gt: new Date() },
            used: false
        })

        console.log(validCode)
        if (!validCode) {
            respuesta.status = 'error';
            respuesta.msg = 'El codigo no es correcto o ya expiró';
            return res.status(404).json(respuesta);
        }

        //
        validCode.used = true;
        await validCode.save();
        //  generar JWT
        const tkn = generarJWT({ userId });
        respuesta.status = 'success';
        respuesta.msg = 'Autenticación exitosa';
        respuesta.data = tkn;
        return res.status(200).json(respuesta);


    } catch (error) {
        console.log(error);

        respuesta.status = 'error';
        respuesta.msg = 'Error al iniciar sesión';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }

}

const tokenResetPassword = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    try {
        const { email } = req.body;
        const existsUser = await Usuario.findOne({ email });

        if (!existsUser) {
            respuesta.status = 'error';
            respuesta.msg = 'El usuario no existe';
            return res.status(404).json(respuesta);
        }

        //  Generar token
        existsUser.token = generarId();
        existsUser.save();

        //  Enviar email con token
        emailOlvidePass({ email, name: existsUser.name, token: existsUser.token });

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

const confirmarTokenReset = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    try {
        const { token } = req.body;
        const isValidToken = await Usuario.findOne({ token });
        if (!isValidToken) {
            respuesta.status = 'error';
            respuesta.msg = 'El token no es válido o ya fue utilizado';
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

const resetPassword = async (req, res) => {
    // #swagger.tags = ['Auth']

    let respuesta = new Respuesta();
    try {
        const { pass,token } = req.body;

        const isValidToken = await Usuario.findOne({ token });
        if (!isValidToken) {
            respuesta.status = 'error';
            respuesta.msg = 'El token no es válido o ya fue utilizado';
            return res.status(400).json(respuesta);
        }

        //  Nueva password
        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        isValidToken.token = '';
        isValidToken.pass = hashedPassword;

        console.log(isValidToken);
        await isValidToken.save();


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
}