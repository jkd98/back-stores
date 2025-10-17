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
export const alertaStockMinimo = scheduleJob('0 0 14 * * *', async () => {
    console.log("Tarea programada")
    try {
        const productos = await Producto.findAll({ where: { borrado: false }, include: { model: Proveedor, as: 'proveedor' } });
        const productosFaltantes = productos.filter(p => p.stock_actual < p.stock_minimo);
        let provedores = new Map();

        productosFaltantes.forEach(p => {
            if (!provedores.has(p.id_proveedor)) {
                provedores.set(
                    p.id_proveedor,
                    {
                        email: p.proveedor.contacto,
                        nombre: p.proveedor.nombre,
                        productos: []
                    }
                );
            }

            provedores.get(p.id_proveedor).productos.push(p);
        });

        //console.log(provedores);
        for (let p of provedores) {
            // Dado que la version de prueba solo permite 1 envio por cada 10 segundos se uso un timeout
            await sendEmail({ email: p[1].email, name: p[1].nombre, productos: p[1].productos })

        }

    } catch (error) {
        console.log(error);
        console.log("No se pudieron traer los productos");
    }
})

// Función sleep para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve,ms));

// Funcion que envía el email con un retraso de 10 segundos entre envío
const sendEmail = async ({ email, name, productos }) => {
    // Espera el tiempo de retraso (10 segundos)
    console.log(`Esperando 10s antes de enviar a ${name}...`);
    await sleep(10000); 
    
    // Ejecuta la función de envío real y ESPERA su resultado (y errores).
    try {
        await emailAlerta({ email, name, productos }); 
        console.log(`Email enviado con éxito a ${name}.`);
    } catch (error) {
        console.log('Error al enviar el email')
    }
}
