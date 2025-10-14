import { Cliente, Movimiento, Producto, Proveedor, Respuesta } from "../models/index.js";


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

        if (tipo === 'Entrada') {
            if (!id_proveedor) {
                respuesta.status = 'error';
                respuesta.msg = 'Ingresa el proveedor';
                return res.status(404).json(respuesta);
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
                return res.status(404).json(respuesta);
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