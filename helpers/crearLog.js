import { Log } from '../models/index.js'

export const crearLog = async ({ level, msg, userEmail, path, ip }) => {
  try {
    const log = Log.build({ level, msg, userEmail, path, ip });
    await log.save()
  } catch (error) {
    console.log("Error al gaurdar el log: ", error)
  }
}

export const NivelesLog = Object.freeze({
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
});

export const obtenerIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
};