import { Op } from "sequelize";
import { Cliente, Movimiento, Producto, Proveedor, Respuesta } from "../models/index.js";
import { emailAlerta } from "../helpers/email.js";
import ExcelJS from 'exceljs'; // Importamos la librería para generar Excel

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
                await emailAlerta({productos:[productExists],email:req.usuario.email})
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

/**
 * Función para exportar todos los movimientos a un archivo Excel (.xlsx)
 */
export const exportarMovimientosExcel = async (req, res) => {
    // #swagger.tags = ['Movimiento']
    try {
        // 1. Obtener todos los movimientos con sus relaciones
        const movs = await Movimiento.findAll({
            // Asegúrate de que las relaciones están bien definidas en tus modelos
            include: [
                { model: Producto, as: 'producto' },
                { model: Proveedor, as: 'proveedor' },
                { model: Cliente, as: 'cliente' }
            ],
            order: [['fecha', 'DESC']]
        });

        if (!movs || movs.length === 0) {
            let respuesta = new Respuesta();
            respuesta.status = 'warning';
            respuesta.msg = 'No hay movimientos registrados para exportar.';
            return res.status(200).json(respuesta);
        }

        // 2. Crear el libro y la hoja de trabajo
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistema de Inventario';
        workbook.lastModifiedBy = 'Sistema de Inventario';
        workbook.created = new Date();
        workbook.modified = new Date();

        const worksheet = workbook.addWorksheet('Reporte de Movimientos');

        // 3. Definir las cabeceras
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 20 },
            { header: 'Tipo', key: 'tipo', width: 15 },
            { header: 'Producto', key: 'producto', width: 30 },
            { header: 'Código Producto', key: 'codigo_producto', width: 20 },
            { header: 'Cantidad', key: 'cantidad', width: 15 },
            { header: 'Responsable', key: 'responsable', width: 35 },
            { header: 'ID Responsable', key: 'id_responsable', width: 20 }
        ];

        // 4. Aplicar estilos a las cabeceras
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '363636' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // 5. Llenar las filas con los datos
        movs.forEach((mov, index) => {
            // Determinar el responsable
            const responsableNombre = mov.tipo === 'Entrada'
                ? mov.proveedor?.nombre || 'N/A'
                : mov.cliente?.nombre || 'N/A';

            const responsableId = mov.tipo === 'Entrada'
                ? mov.id_proveedor
                : mov.id_cliente;

            // Formatear la fecha
            const fechaFormateada = mov.fecha ? new Date(mov.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'N/A';

            worksheet.addRow({
                id: mov.id_movimiento,
                fecha: fechaFormateada,
                tipo: mov.tipo,
                producto: mov.producto?.nombre || 'Producto Desconocido',
                codigo_producto: mov.producto?.codigo || 'N/A',
                cantidad: mov.cantidad,
                responsable: responsableNombre,
                id_responsable: responsableId
            });

            // Aplicar estilo al contenido (ej. borde inferior)
            worksheet.getRow(index + 2).eachCell((cell) => {
                cell.border = { bottom: { style: 'thin', color: { argb: 'E0E0E0' } } };
            });
        });

        // 6. Configurar la respuesta HTTP para descargar el archivo
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + `Reporte_Movimientos_${Date.now()}.xlsx`
        );

        // 7. Enviar el archivo
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.log(error);
        let respuesta = new Respuesta();
        respuesta.status = 'error';
        respuesta.msg = 'Error al generar el reporte de movimientos';
        return res.status(500).json(respuesta);
    }
}