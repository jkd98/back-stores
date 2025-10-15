import { Op } from "sequelize";
import { Cliente, Movimiento, Producto, Proveedor, Respuesta } from "../models/index.js";

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
        id_proveedor,
        id_cliente
    } = req.body;

    try {

        if (!(tipo === 'Entrada' || tipo === 'Salida')) {
            respuesta.status = 'error';
            respuesta.msg = 'El tipo de movimiento no es válido, intente otra vez';
            return res.status(404).json(respuesta);
        }

        const productExists = await Producto.findOne({ where: { codigo } });

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

        if (tipo === 'Entrada') {
            if (!id_proveedor) {
                respuesta.status = 'error';
                respuesta.msg = 'Ingresa el proveedor';
                return res.status(400).json(respuesta);
            }
            const proveedorExists = await Proveedor.findByPk(id_proveedor);
            if (!proveedorExists) {
                respuesta.status = 'error';
                respuesta.msg = 'El proveedor no esta registrado';
                return res.status(404).json(respuesta);
            }

            if (productExists.id_proveedor != id_proveedor) {
                respuesta.status = 'error';
                respuesta.msg = 'El producto no pertenece a este proveedor';
                return res.status(400).json(respuesta);
            }

            const nwMovimiento = Movimiento.build({
                tipo,
                id_producto: productExists.id_producto,
                cantidad,
                id_proveedor
            })
            productExists.stock_actual += cantidad;

            Promise.allSettled([await nwMovimiento.save(), await productExists.save()]);

            respuesta.status = 'success';
            respuesta.msg = 'El movimiento de entrada a sido completado';
            respuesta.data = nwMovimiento;
            res.status(201).json(respuesta);

        }

        if (tipo === 'Salida') {
            if (!id_cliente) {
                respuesta.status = 'error';
                respuesta.msg = 'Ingresa el cliente';
                return res.status(400).json(respuesta);
            }
            const clienteExists = await Cliente.findByPk(id_cliente);
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
                tipo,
                id_producto: productExists.id_producto,
                cantidad,
                id_cliente
            })
            productExists.stock_actual -= cantidad;

            Promise.allSettled([await nwMovimiento.save(), await productExists.save()]);

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
    let respuesta = new Respuesta();
    const { page = 1, limit = 5 } = req.query;
    const { fecha, tipo, proveedor, cliente, producto } = req.body;
    let whers = [];
    let filters = [];
    let movs = [];
    try {

        if (fecha) {
            whers = [...whers, { fecha: { [Op.eq]: new Date(fecha)  } }];
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