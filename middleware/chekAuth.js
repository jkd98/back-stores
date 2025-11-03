import jwt from "jsonwebtoken"
import { Respuesta, Usuario } from '../models/index.js'

const checkAuth = async (req, res, next) => {
    let token;
    let respuesta = new Respuesta();

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.usuario = await Usuario.findOne({ where: { id: decoded.userId } });
            return next();
        } catch (error) {
            respuesta.status = 'error';
            respuesta.msg = 'Hubo un error al comprobar el token';
            return res.status(404).json(respuesta);
        }
    };

    if (!token) {
        respuesta.status = 'error';
        respuesta.msg = 'JWToken no válido';
        return res.status(401).json(respuesta);
    }

    next(); // avanza al sig middleware
}

export default checkAuth;