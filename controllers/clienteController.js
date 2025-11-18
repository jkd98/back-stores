import { Op } from "sequelize";
import { Cliente, Respuesta } from "../models/index.js";

/**
 * Función para registrar a un nuevo cliente
 */
export const registrarCliente = async (req, res) => {
    // #swagger.tags = ['Cliente']
    let respuesta = new Respuesta();
    const {
        nombre,
        telf,
        contacto
    } = req.body;
    try {
        const clienteExists = await Cliente.findOne({
            where: {
                [Op.or]: [{ contacto }, { telf }]
            }
        });

        if (clienteExists) {
            if (clienteExists.contacto === contacto) {
                respuesta.status = 'error';
                respuesta.msg = 'Ya existe un cliente regitrado con este email';
                return res.status(400).json(respuesta);
            }

            if (clienteExists.telf === telf) {
                respuesta.status = 'error';
                respuesta.msg = 'Ya existe un cliente regitrado con este número de teléfono';
                return res.status(400).json(respuesta);
            }
        }


        const nwCliente = Cliente.build({
            nombre,
            telf,
            contacto
        })

        await nwCliente.save()

        respuesta.status = 'success';
        respuesta.msg = 'Nuevo cliente registrado';
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo registrar al ciente';
        return res.status(500).json(respuesta)
    }
}

/**
 * Función para listar a todos los clientes con paginación
 */
export const listAllClientes = async (req, res) => {
    // #swagger.tags = ['Cliente']
    let respuesta = new Respuesta();
    const { page = 1, limit = 5 } = req.query;
    try {
        const clients = await Cliente.findAll(
            { where: { disable: false }, limit: parseInt(limit), offset: parseInt(page - 1) * parseInt(limit) }
        );
        respuesta.status = 'success';
        respuesta.msg = 'Listado de clientes';
        respuesta.data = clients;
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudieron traer a los clientes';
        return res.status(500).json(respuesta)
    }
}

/**
 * Función para obtener un cliente por su ID
 */
export const obtenerClientePorId = async (req, res) => {
    let respuesta = new Respuesta();
    const { id_cliente } = req.body;
    try {
        const client = await Cliente.findByPk(id_cliente);
        if (!client) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró al cliente';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Cliente encontrado';
        respuesta.data = client;
        return res.status(200).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo traer al cliente';
        return res.status(500).json(respuesta)
    }
}


/**
 * Función para editar a un cliente
 */
export const editarCliente = async (req, res) => {
    // #swagger.tags = ['Cliente']
    let respuesta = new Respuesta();
    const { id_cliente, nombre, telf, contacto } = req.body;
    let whers = [];
    try {
        const client = await Cliente.findByPk(id_cliente);

        if (!client) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró al cliente';
            return res.status(404).json(respuesta);
        }

        if (telf) {
            whers = [...whers, { telf }]
        }

        if (contacto) {
            whers = [...whers, { contacto }]
        }

        if (whers.length > 0) {
            const clientExists = await Cliente.findOne({ where: { id_cliente: { [Op.ne]: id_cliente }, [Op.or]: whers } })
            if (clientExists && clientExists.id_cliente !== client.id_cliente) {
                if (clientExists.telf === telf) {
                    respuesta.status = 'error';
                    respuesta.msg = 'Ya existe un cliente registrado con ese número de teléfono';
                    return res.status(400).json(respuesta);
                }

                if (clientExists.contacto === contacto) {
                    respuesta.status = 'error';
                    respuesta.msg = 'Ya existe un cliente registrado con ese email';
                    return res.status(400).json(respuesta);
                }
            }
        }

        client.nombre = nombre || client.nombre;
        client.telf = telf || client.telf;
        client.contacto = contacto || client.contacto;

        client.save();

        respuesta.status = 'success';
        respuesta.msg = 'Cliente actualizado correctamente';
        respuesta.data = client;
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo actualizar al cliente';
        return res.status(500).json(respuesta)
    }
}

/**
 * Función para eliminar a un cliente
 */
export const eliminarCliente = async (req, res) => {
    // #swagger.tags = ['Cliente']

    let respuesta = new Respuesta();
    const { contacto } = req.body;
    try {
        const client = await Cliente.findOne({ where: { contacto } });
        if (!client) {
            respuesta.status = 'error';
            respuesta.msg = 'El cliente no existe';
            return res.status(404).json(respuesta);
        }

        if (client.disable) {
            respuesta.status = 'error';
            respuesta.msg = 'El cliente ya ha sido eliminado';
            return res.status(404).json(respuesta);
        }

        client.disable = true;

        await client.save();

        respuesta.status = 'success';
        respuesta.msg = 'Cliente eliminado correctamente';
        return res.status(200).json(respuesta);

    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'El cliente no se pudo eliminar';
        return res.status(500).json(respuesta);
    }
}