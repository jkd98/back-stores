// Codigo para limpiar la DB, cada que finalicen las pruebas

import {exit} from 'node:process';
import db from '../config/db.js';

const clearDB = async () => {
    try {
        await db.sync({force:true})
        console.log("Datos eliminados correctamente")
        exit(0);
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

// process.argv --> codigo que se ejecuta desde el cli de node

// [2] --> es la posicion de los parametros enviados, dado que es un array 
// [que lo esta mandando llamar (ubicación), archivo que se manda llamar, --args]
// process.argv[2] 
if(process.argv[2] === '--clear'){
    clearDB()
}

console.log(process.argv);