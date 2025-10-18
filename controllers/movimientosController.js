import { Op } from "sequelize";
import { Cliente, Movimiento, Producto, Proveedor, Respuesta } from "../models/index.js";
import { emailAlerta } from "../helpers/email.js";

//#region registraMovimeito
/**
 * Función para registrar movimientos de entrada o salida
 */
export const registrarMovimiento = async (req, res) => {
    // #swagger.tags=['Movimiento']
    let respuesta = new Respuesta();
    const {
        tipo,
        codigo,
        cantidad,
        responsable
    } = req.body;

    try {

        if (!(tipo.toLowerCase() === 'entrada' || tipo.toLowerCase() === 'salida')) {
            respuesta.status = 'error';
            respuesta.msg = 'El tipo de movimiento no es válido, intente otra vez';
            return res.status(404).json(respuesta);
        }

        const productExists = await Producto.findOne({ where: { codigo }, include: { model: Proveedor, as: 'proveedor' } });

        if (!productExists) {
            respuesta.status = 'error';
            respuesta.msg = 'El producto no existe';
            return res.status(404).json(respuesta);
        }

        if (productExists.borrado) {
            respuesta.status = 'error';
            respuesta.msg = 'El producto no esta disponible, ha sido eliminado';
            return res.status(400).json(respuesta);
        }

        if (tipo.toLowerCase() === 'entrada') {
            const proveedorExists = await Proveedor.findByPk(responsable);
            if (!proveedorExists) {
                respuesta.status = 'error';
                respuesta.msg = 'El proveedor no esta registrado';
                return res.status(404).json(respuesta);
            }

            if (productExists.id_proveedor != responsable) {
                respuesta.status = 'error';
                respuesta.msg = 'El producto no pertenece a este proveedor';
                return res.status(400).json(respuesta);
            }

            const nwMovimiento = Movimiento.build({
                tipo:tipo.toLowerCase()==='entrada'&&'Entrada',
                id_producto: productExists.id_producto,
                cantidad,
                id_proveedor: responsable
            })
            productExists.stock_actual += cantidad;

            Promise.allSettled([await nwMovimiento.save(), await productExists.save()]);

            respuesta.status = 'success';
            respuesta.msg = 'El movimiento de entrada a sido completado';
            respuesta.data = nwMovimiento;
            res.status(201).json(respuesta);

        }

        if (tipo.toLowerCase() === 'salida') {
            const clienteExists = await Cliente.findByPk(responsable);
            if (!clienteExists) {
                respuesta.status = 'error';
                respuesta.msg = 'El cliente no existe';
                return res.status(404).json(respuesta);
            }

            if (productExists.stock_actual < cantidad) {
                respuesta.status = 'error';
                respuesta.msg = 'La cantidad de productos a comprar es mayor a la del stock actual';
                return res.status(404).json(respuesta);
            }

            const nwMovimiento = Movimiento.build({
                tipo:tipo.toLowerCase()==='salida'&&'Salida',
                id_producto: productExists.id_producto,
                cantidad,
                id_cliente: responsable
            })
            productExists.stock_actual -= cantidad;

            Promise.allSettled([await nwMovimiento.save(), await productExists.save()]);

            if (productExists.stock_actual < productExists.stock_minimo){
                await emailAlerta({productos:[productExists]})
            }

                respuesta.status = 'success';
            respuesta.msg = 'El movimiento de salida a sido completado';
            respuesta.data = nwMovimiento;
            res.status(201).json(respuesta);
        }

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo registrar el movimiento';
        return res.status(500).json(respuesta);
    }
}
//#endregion


/**
 * Función para listar todos los movimientos con paginación
 */
export const listAllMovs = async (req, res) => {
    // #swagger.tags = ['Movimiento']
    let respuesta = new Respuesta();
    const { page = 1, limit = 5 } = req.query;
    try {
        const movs = await Movimiento.findAll(
            { limit: parseInt(limit), offset: parseInt(page - 1) * parseInt(limit) }
        )

        respuesta.status = 'success';
        respuesta.msg = `Movimientos listados página: ${page}`
        respuesta.data = movs;

        return res.status(200).json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'No se pudieron listar los movimientos';
        return res.status(500).json(respuesta);
    }
}

/**
 * Función para filtrar movimientos
 */
export const filtrarMovimientos = async (req, res) => {
    // #swagger.tags = ['Movimiento']

    let respuesta = new Respuesta();
    const { page = 1, limit = 5 } = req.query;
    const { fecha, tipo, proveedor, cliente, producto } = req.body;
    let whers = [];
    let filters = [];
    let movs = [];
    try {

        if (fecha) {
            const inicioDia = new Date(fecha + 'T00:00:00.000Z'); // UTC
            const finDia = new Date(fecha + 'T23:59:59.999Z');    // UTC

            whers = [...whers, {
                fecha: {
                    [Op.gte]: inicioDia,  // Mayor o igual al inicio del día
                    [Op.lt]: finDia      // Menor al inicio del día siguiente
                }
            }];
            filters = [...filters, 'fecha'];
        }

        if (tipo) {
            whers = [...whers, { tipo }];
            filters = [...filters, 'tipo'];
        }

        if (proveedor) {
            whers = [...whers, { id_proveedor: proveedor }];
            filters = [...filters, 'proveedor'];
        }

        if (cliente) {
            whers = [...whers, { id_cliente: cliente }];
            filters = [...filters, 'cliente'];
        }

        if (producto) {
            whers = [...whers, { id_producto: producto }];
            filters = [...filters, 'producto'];
        }

        if (whers.length > 0) {
            movs = await Movimiento.findAll(
                {
                    where: {
                        [Op.and]: whers
                    },
                    limit: parseInt(limit),
                    offset: parseInt(page - 1) * parseInt(limit)
                }
            );
            respuesta.status = 'success';
            respuesta.msg = `Movimientos filtrados por ${filters.join(', ')}`
            respuesta.data = movs;

            return res.status(200).json(respuesta);
        }

        movs = await Movimiento.findAll(
            {
                where: {},
                limit: parseInt(limit),
                offset: parseInt(page - 1) * parseInt(limit)
            }
        );

        respuesta.status = 'success';
        respuesta.msg = `Movimientos filtrados página: ${page}`
        respuesta.data = movs;

        return res.status(200).json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'No se pudieron filtrar los movimientos';
        return res.status(500).json(respuesta);
    }
}