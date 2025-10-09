
import { Token } from "./Token.js";
import { Usuario } from "./Usuario.js";
import { Respuesta } from "./Respuesta.js";
import { Log } from "./Logs.js";


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


export {
    Token,
    Usuario,
    Respuesta,
    Log
}