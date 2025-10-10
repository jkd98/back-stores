
import { Token } from "./Token.js";
import { Usuario } from "./Usuario.js";
import { Respuesta } from "./Respuesta.js";
import { Log } from "./Logs.js";
import { Producto } from "./Producto.js";
import { Movimiento } from "./Movimiento.js";
import { Proveedor } from "./Proveedor.js";
import { Cliente } from "./Cliente.js";

/// Usuario - Token

// Un Token pertenece a un Usuario (clave foránea en Token)
Token.belongsTo(Usuario, {
    foreignKey: 'userId',
    as: 'user' // Nombre de la propiedad que usarás en include/get
});

// Un Usuario puede tener muchos Tokens
Usuario.hasMany(Token, {
    foreignKey: 'userId',
    as: 'tokens' // Nombre de la propiedad que usarás en include/get
});


/// Producto - Proveedor
Producto.belongsTo(Proveedor, {
    foreignKey: 'id_proveedor',
    as: 'proveedor'
})
Proveedor.hasMany(Producto, {
    foreignKey: 'id_proveedor',
    as: 'producto'
})


/// Movimiento - Producto
Movimiento.belongsTo(Producto, {
    foreignKey: 'id_producto',
    as: 'producto'
});

Producto.hasMany(Movimiento, {
    foreignKey: 'id_producto',
    as: 'Movimientos'
});

/// Movimeinto - Proveedor
Movimiento.belongsTo(Proveedor, {
    foreignKey: 'id_proveedor',
    as: 'proveedor'
});

Proveedor.hasMany(Movimiento, {
    foreignKey: 'id_proveedor',
    as: 'Movimiento'
})

/// Movimeinto - cliente
Movimiento.belongsTo(Cliente, {
    foreignKey: 'id_cliente',
    as: 'cliente'
});

Cliente.hasMany(Movimiento, {
    foreignKey: 'id_cliente',
    as: 'Movimiento'
})


export {
    Token,
    Usuario,
    Respuesta,
    Log,
    Producto,
    Movimiento,
    Proveedor,
    Cliente
}