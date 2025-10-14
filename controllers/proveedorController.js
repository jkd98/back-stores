import { Op } from "sequelize";
import { Proveedor, Respuesta } from "../models/index.js"

export const registrarProveedor = async (req, res) => {
    // #swagger.tags = ['Proveedor']

    let respuesta = new Respuesta();
    const {
        nombre,
        telf,
        contacto
    } = req.body;
    try {

        const proveedorExists = await Proveedor.findOne({
            where: {
                [Op.or]: [{ contacto }, { telf }]
            }
        });

        if (proveedorExists) {
            if (proveedorExists.contacto === contacto) {
                respuesta.status = 'error';
                respuesta.msg = 'Ya existe un proveedor regitrado con este email';
                return res.status(400).json(respuesta);
            }

            if (proveedorExists.telf === telf) {
                respuesta.status = 'error';
                respuesta.msg = 'Ya existe un proveedor regitrado con este número de teléfono';
                return res.status(400).json(respuesta);
            }
        }


        const nwProveedor = Proveedor.build({
            nombre,
            telf,
            contacto
        })

        await nwProveedor.save()

        respuesta.status = 'success';
        respuesta.msg = 'Nuevo proveedor registrado';
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo registrar al proveedor';
        return res.status(500).json(respuesta);
    }
}

export const listAllProviders = async (req, res) => {
    // #swagger.tags = ['Proveedor']
    let respuesta = new Respuesta();
    try {
        const providers = await Proveedor.findAll();
        respuesta.status = 'success';
        respuesta.msg = 'Listado de proveedores';
        respuesta.data = providers;
        return res.status(201).json(respuesta);
    
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudieron traer a los proveedores';
        return res.status(500).json(respuesta)
    }
}