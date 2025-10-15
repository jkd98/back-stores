import { Log } from '../models/index.js';

import { obtenerIP,NivelesLog } from '../helpers/crearLog.js'
import { Op } from 'sequelize';

const LIMITE_INTENTOS = 3;
const VENTANA_TIEMPO_MIN = 3; // Tiempo que se resta a la hora actual
const BLOQUEO_MIN = 3; // Tiempo que bloquea la ip

const bloqueos = new Map(); // Guarda IPs bloqueadas en memoria


export const checkBloquedIP = async (req, res, next) => {
    const ip = obtenerIP(req);
    console.log(req.body)

    // Si la IP está en lista de bloqueo
    if (bloqueos.has(ip)) {
        const tiempoBloqueo = bloqueos.get(ip);
        if (Date.now() < tiempoBloqueo) {
            return res.status(429).json({ message: 'Demasiados intentos. Intenta más tarde.' });
        } else {
            bloqueos.delete(ip); // Ya pasó el tiempo
        }
    }

    // Buscar intentos fallidos recientes en BD
    const desde = new Date(Date.now() - VENTANA_TIEMPO_MIN * 60 * 1000); // últimos N minutos

    const intentosFallidos = await Log.count({where:{
        ip, //Para mitigar DDoS
        path: '/auth/verify-2fa',
        level: NivelesLog.ERROR,
        date: { [Op.gte]: desde }
    }});



    if (intentosFallidos >= LIMITE_INTENTOS) {
        bloqueos.set(ip, Date.now() + BLOQUEO_MIN * 60 * 1000);
        return res.status(429).json({ message: 'Demasiados intentos. Intenta más tarde.' });
    }

    next();
};
