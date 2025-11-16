import { Op } from "sequelize";
import { Proveedor, Respuesta } from "../models/index.js"

/**
 * Función para registrar a un nuevo proveedor
 */
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

/**
 * Función para listar a todos los proveedores con paginación
 */
export const listAllProviders = async (req, res) => {
    // #swagger.tags = ['Proveedor']
    let respuesta = new Respuesta();
    const { page = 1, limit = 5 } = req.query;
    try {
        const providers = await Proveedor.findAll(
            { where: { disable: false }, limit: parseInt(limit), offset: parseInt(page - 1) * parseInt(limit) }
        );
        respuesta.status = 'success';
        respuesta.msg = 'Listado de proveedores';
        respuesta.data = providers;
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudieron traer a los proveedores';
        return res.status(500).json(respuesta)
    }
}

/**
 * Función para traer a un solo proveedor por id 
 * */
export const obtenerProveedorPorId = async (req, res) => {
    let respuesta = new Respuesta();
    const { id_proveedor } = req.body;
    try {
        const provider = await Proveedor.findByPk(id_proveedor);

        if (!provider) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró al proveedor';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Proveedor encontrado';
        respuesta.data = provider;
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo traer al proveedor';
        return res.status(500).json(respuesta);
    }
}

/**
 * Función para editar a un proveedor
 */
export const editarProveedor = async (req, res) => {
    // #swagger.tags = ['Proveedor']
    let respuesta = new Respuesta();
    const { id_proveedor, nombre, telf, contacto } = req.body;
    let whers = [];
    try {
        const provider = await Proveedor.findByPk(id_proveedor);

        if (!provider) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró al proveedor';
            return res.status(404).json(respuesta);
        }

        if (telf) {
            whers = [...whers, { telf }]
        }

        if (contacto) {
            whers = [...whers, { contacto }]
        }

        if (whers.length > 0) {
            console.log(whers);
            const providerExists = await Proveedor.findOne({ where: { [Op.or]: whers } })
            if (providerExists && providerExists.id_proveedor !== provider.id_proveedor) {
                if (providerExists.telf === telf) {
                    respuesta.status = 'error';
                    respuesta.msg = 'Ya existe un proveedor registrado con ese número de teléfono';
                    return res.status(400).json(respuesta);
                }

                if (providerExists.contacto === contacto) {
                    respuesta.status = 'error';
                    respuesta.msg = 'Ya existe un proveedor registrado con ese email';
                    return res.status(400).json(respuesta);
                }
            }
        }

        provider.nombre = nombre || provider.nombre;
        provider.telf = telf || provider.telf;
        provider.contacto = contacto || provider.contacto;

        provider.save();

        respuesta.status = 'success';
        respuesta.msg = 'Proveedor actualizado correctamente';
        respuesta.data = provider;
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo actualizar al proveedor';
        return res.status(500).json(respuesta)
    }
}

/**
 * Función para eliminar un proveedor
 */
export const eliminarProveedor = async (req, res) => {
    // #swagger.tags = ['Proveedor']

    let respuesta = new Respuesta();
    const { contacto } = req.body;
    try {
        const provider = await Proveedor.findOne({ where: { contacto } });
        if (!provider) {
            respuesta.status = 'error';
            respuesta.msg = 'El provedor no existe';
            return res.status(404).json(respuesta);
        }

        if (provider.disable) {
            respuesta.status = 'error';
            respuesta.msg = 'El provedor ya ha sido eliminado';
            return res.status(404).json(respuesta);
        }

        provider.disable = true;

        await provider.save();

        respuesta.status = 'success';
        respuesta.msg = 'Proveedor eliminado correctamente';
        return res.status(200).json(respuesta);

    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'El provedor no se pudo eliminar';
        return res.status(500).json(respuesta);
    }
}