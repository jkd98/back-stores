import { Op } from "sequelize";
import { Movimiento, Producto, Proveedor, Respuesta } from "../models/index.js"

/**
 * Función que registra un nuevo producto con cantidad igual a cero (0)
 */
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
            nombre,
            descip,
            categoria,
            unidad,
            stock_minimo,
            id_proveedor
        })

        await nwProduct.save();

        const nwMovimiento = await Movimiento.create({
            tipo: 'Entrada',
            id_producto: nwProduct.id_producto,
            cantidad: nwProduct.stock_actual,
            id_proveedor: proveedorExists.id_proveedor
        });

        respuesta.status = 'success';
        respuesta.msg = 'Nuevo producto registrado';
        respuesta.data = nwMovimiento;
        return res.status(201).json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo registrar el producto';
        return res.status(500).json(respuesta);
    }
}

/**
 * Función para listar todos los productos usando paginación
 */
export const listAllProducts = async (req, res) => {
    // #swagger.tags = ['Producto']
    const { page = 1, limit = 5 } = req.query;
    let respuesta = new Respuesta();
    try {
        const products = await Producto.findAll(
            { limit: parseInt(limit), offset: parseInt(page - 1) * parseInt(limit) }
        );

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

/**
 * Función para editar codigo, nombre, descrip, unidad de medida y el estock minimo
 */
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

/**
 * Función para filtrar productos por nombre, categoria o proveedor
 */
export const filtrarProductos = async (req, res) => {
    // #swagger.tags = ['Producto']
    const { page = 1, limit = 5 } = req.query;
    let respuesta = new Respuesta();
    const { nombre, categoria, proveedor } = req.body;
    let whers = [];
    let filters = [];
    let products = [];
    try {
        if (nombre) {
            whers = [...whers, { nombre: { [Op.iLike]: `%${nombre}%` } }];
            filters = [...filters, 'nombre'];
        }

        if (categoria) {
            whers = [...whers, { categoria }];
            filters = [...filters, 'categoria'];
        }

        if (proveedor) {
            whers = [...whers, { id_proveedor: proveedor }];
            filters = [...filters, 'proveedor'];
        }

        if (whers.length > 0) {
            products = await Producto.findAll(
                {
                    where: {
                        [Op.and]: whers
                    },
                    limit,
                    offset: parseInt(page - 1) * parseInt(limit)
                }
            );
            respuesta.msg = `Coincidencias de productos por ${filters.join(', ')}`;
        } else {
            products = await Producto.findAll(
                {
                    where: {},
                    limit: parseInt(limit),
                    offset: parseInt(page - 1) * parseInt(limit)
                }
            );
            respuesta.msg = 'Coincidencias de productos sin filtros';
        }

        respuesta.status = 'success';
        respuesta.data = products;
        return res.status(200).json(respuesta);
    } catch (error) {
        console.log(error)
        respuesta.status = 'erros';
        respuesta.msg = 'No se pudieron listar los productos'
        return res.status(500).json(respuesta);
    }
}

/**
 * Función para eliminar un producto por su código
 */
export const eliminarProductos = async (req, res) => {
    // #swagger.tags = ['Producto']

    let respuesta = new Respuesta();
    const { codigo } = req.body;
    try {
        const product = await Producto.findOne({ where: { codigo } });
        if (!product) {
            respuesta.status = 'error';
            respuesta.msg = 'El producto no existe';
            return res.status(404).json(respuesta);
        }

        if (product.borrado) {
            respuesta.status = 'error';
            respuesta.msg = 'El producto ya ha sido borrado';
            return res.status(404).json(respuesta);
        }

        product.borrado = true;

        await product.save();

        respuesta.status = 'success';
        respuesta.msg = 'El producto ha sido eliminado';
        return res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Hubo un error al intentar eliminar el producto';
        return res.status(500).json(respuesta);
    }
}