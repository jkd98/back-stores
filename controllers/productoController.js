import { Producto, Proveedor, Respuesta } from "../models/index.js"

/*
const registrarProducto = async (req, res) => {
    // #swagger.tags = ['Producto']
    let respuesta = new Respuesta();
    const { } = req.body;

    try {

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo registrar el producto';
        res.status(500).json(respuesta);
    }
}
*/

const registrarProducto = async (req, res) => {
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

        if (!productExists) {
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
            stock_actual,
            id_proveedor
        })

        await nwProduct.save();

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


export {
    registrarProducto
}