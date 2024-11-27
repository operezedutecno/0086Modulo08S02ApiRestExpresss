const conexion = require("./../../conexion.js");

const listar = async () => {
    const argumentos = {
        text:"SELECT * FROM equipos ORDER BY id",
        values: []
    }
    const { rows: listado } = await conexion.query(argumentos);

    return listado
}

const consultar = async(id) => {
    const equipo = await conexion.query("SELECT * FROM equipos WHERE id = $1", [id]);
    return equipo.rows[0] || null;
}

const registrar = async (nombre, marca, cantidad) => {
    try {
        const argumentos = {
            text:"INSERT INTO equipos(nombre, marca, cantidad) VALUES($1, $2, $3) RETURNING *",
            values: [nombre.toUpperCase(), marca.toUpperCase(), cantidad]
        }
        const { rows: registros } = await conexion.query(argumentos);
        return { code: 201, registros, message: "Registro de equipo exitoso"};
    } catch (error) {
        if(error.code == "23505") {
            return { code: 409, message: "Ya existe un equipo con el mismo nombre y marca"};
        }
        console.log(error.message);
        return { code: 500, message: "Ocurrió un error registrando equipo"};
    }
    
}

const modificar = async (equipoId, nombre, marca, cantidad) => {
    try {
        const argumentos= {
            text: "UPDATE equipos SET nombre=$1, marca=$2, cantidad=$3 WHERE id = $4 RETURNING *",
            values: [nombre.toUpperCase(), marca.toUpperCase(), cantidad, equipoId]
        }
        const { rows: actualizado } = await conexion.query(argumentos);
        return { code: 200, actualizado, message: "Equipo modificado con éxito"};
    } catch (error) {
        if(error.code == "23505") {
            return { code: 409, message: "Ya existe un equipo con el mismo nombre y marca"};
        }
        console.log(error.message);
        return { code: 500, message: "Ocurrió un error modificando equipo"};
    }
}

const eliminar = async (equipoId) => {
    try {
        const argumentos = {
            text: "DELETE FROM equipos WHERE id=$1 RETURNING *",
            values: [equipoId]
        }
        const { rows: eliminado } = await conexion.query(argumentos);
        return { code: 200, eliminado, message: "Equipo eliminado con éxito"};
    } catch (error) {
        console.log(error.message);
        return { code: 500, message: "Ocurrió un error eliminando equipo"};
    }
}

module.exports = { listar, registrar, modificar, eliminar, consultar }