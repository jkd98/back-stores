import { scheduleJob } from "node-schedule";
import { Producto, Proveedor } from "../models/index.js";
import { Op } from "sequelize";
import { emailAlerta } from "./email.js";


/*
 
    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    │
    │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    │    │    │    │    └───── month (1 - 12)
    │    │    │    └────────── day of month (1 - 31)
    │    │    └─────────────── hour (0 - 23)
    │    └──────────────────── minute (0 - 59) ó *\/n  Para cada n minutos
    └───────────────────────── second (0 - 59, OPTIONAL)

*/

/**
 * Esta es una tarea programada que se ejecuta a las 00:00 hrs todos
 * los dias para revisar que productos estan por debajo del stock mínimo
 * y enviar un email con la lista de los productos.
 */
export const alertaStockMinimo = scheduleJob('0 0 0 * * *', async () => {
    console.log("Tarea programada")
    try {
        const productos = await Producto.findAll({ where: { borrado: false }, include: { model: Proveedor, as: 'proveedor' } });
        const productosFaltantes = productos.filter(p => p.stock_actual < p.stock_minimo);

        await emailAlerta({ productos: productosFaltantes });


    } catch (error) {
        console.log(error);
        console.log("No se pudieron traer los productos");
    }
})


