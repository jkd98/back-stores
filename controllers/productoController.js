import { Op } from "sequelize";
import { Movimiento, Producto, Proveedor, Respuesta } from "../models/index.js"


export const registrarProducto = async (req, res) => {
    // #swagger.tags = ['Producto']
    let respuesta = new Respuesta();
    const {
        codigo,
        nombre,
        descip,
        categoria,
        unidad,
        stock_minimo,
        stock_actual,
        id_proveedor
    } = req.body;

    try {
        const productExists = await Producto.findOne({ where: { codigo } });
        if (productExists) {
            respuesta.status = 'error';
            respuesta.msg = 'Ya hay un producto registrado con ese código';
            return res.status(400).json(respuesta);
        }

        const proveedorExists = await Proveedor.findByPk(id_proveedor);

        if (!proveedorExists) {
            respuesta.status = 'error';
            respuesta.msg = 'El proveedor no existe';
            return res.status(400).json(respuesta);
        }


        const nwProduct = Producto.build({
            codigo,
            nombre: nombre.toLowerCase(),
            descip,
            categoria,
            unidad,
            stock_minimo,
            stock_actual,
            id_proveedor
        })

        await nwProduct.save();

        const nwMovimiento = await Movimiento.create({
            tipo: 'Entrada',
            id_producto: nwProduct.id_producto,
            cantidad: stock_actual,
            id_proveedor: proveedorExists.id_proveedor
        });

        respuesta.status = 'success';
        respuesta.msg = 'Nuevo producto registrado';
        return res.status(201).json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo registrar el producto';
        return res.status(500).json(respuesta);
    }
}

export const editarProducto = async (req, res) => {
    // #swagger.tags = ['Producto']
    let respuesta = new Respuesta();
    const {
        codigo,
        nombre,
        descip,
        categoria,
        unidad,
        stock_minimo,
    } = req.body;

    try {
        const product = await Producto.findOne({ where: { codigo } });
        if (!product) {
            respuesta.status = 'error';
            respuesta.msg = 'El producto no existe';
            return res.status(404).json(respuesta);
        }

        product.nombre = nombre || product.nombre;
        product.descip = descip || product.descip;
        product.categoria = categoria || product.categoria;
        product.unidad = unidad || product.unidad;
        product.stock_minimo = stock_minimo || product.stock_minimo;

        await product.save();

        respuesta.status = 'success';
        respuesta.msg = 'Producto editado correctamente';
        respuesta.data = product;
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo editar el producto'
        return res.status(500).json(respuesta);
    }
}

export const listAllProducts = async (req, res) => {
    // #swagger.tags = ['Producto']

    let respuesta = new Respuesta();
    const { offset } = req.body;
    try {
        const products = await Producto.findAll({ limit: 5, offset });

        respuesta.status = 'success';
        respuesta.msg = 'Listado de productos'
        respuesta.data = products;
        res.status(200).json(respuesta);

    } catch (error) {
        console.log(error)
        respuesta.status = 'erros';
        respuesta.msg = 'No se pudieron listar los productos'
        return res.status(500).json(respuesta);
    }
}

export const filtrarProductos = async (req, res) => {
    // #swagger.tags = ['Producto']

    let respuesta = new Respuesta();
    const { nombre, categoria, proveedor, offset } = req.body;
    try {
        let products = [];
        if (nombre) {
            products = await Producto.findAll({
                where: { nombre: nombre.toLowerCase() }
            }, { limit: 1, offset });
        }

        if (categoria) {

        }

        respuesta.status = 'success';
        respuesta.msg = 'Listado de productos filtrados'
        respuesta.data = products;
        res.status(200).json(respuesta);

    } catch (error) {
        console.log(error)
        respuesta.status = 'erros';
        respuesta.msg = 'No se pudieron listar los productos'
        return res.status(500).json(respuesta);
    }
}

export const eliminarProductos = async (req, res) => {
    // #swagger.tags = ['Producto']

    let respuesta = new Respuesta();
    const { code } = req.body;
    try {
        const product = await Producto.findOne({ where: { code } });
        if (!product) {
            respuesta.status = 'error';
            respuesta.msg = 'El producto no existe';
            return res.status(404).json(respuesta);
        }

        await product.destroy()

        respuesta.status = 'success';
        respuesta.msg = 'El producto ha sido eliminado';
        return res.status(200).json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'Hubo un error al intentar eliminar el producto';
        return res.status(500).json(respuesta);
    }
}