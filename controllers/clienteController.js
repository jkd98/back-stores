import { Op } from "sequelize";
import { Cliente, Respuesta } from "../models/index.js";


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
                respuesta.msg = 'Ya existe un proveedor regitrado con este email';
                return res.status(400).json(respuesta);
            }

            if (clienteExists.telf === telf) {
                respuesta.status = 'error';
                respuesta.msg = 'Ya existe un proveedor regitrado con este número de teléfono';
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
        respuesta.msg = 'Nuevo proveedor registrado';
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo registrar al ciente';
        return res.status(500).json(respuesta)
    }
}

export const listAllClientes = async (req, res) => {
    // #swagger.tags = ['Cliente']

    let respuesta = new Respuesta();
    try {
        const clients = await Cliente.findAll();
        respuesta.status = 'success';
        respuesta.msg = 'Listado de cliente';
        respuesta.data = clients;
        return res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudieron traer a los clientes';
        return res.status(500).json(respuesta)
    }
}