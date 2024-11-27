const express = require("express");
const { listar, registrar, modificar, eliminar, consultar } = require("./funciones/equipos/consultas.js");
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => { 
    console.log(`Aplicación ejecutándose por el puerto ${port}`);
});

const validRegister = (request, response, next) => {
    if(!request.body.nombre || request.body.nombre.trim() == "") {
        return response.status(422).json({ message: "Por favor enviar el nombre"});
    }
    if(!request.body.marca || request.body.marca.trim() == "") {
        return response.status(422).json({ message: "Por favor enviar la marca"});
    }
    if(!request.body.cantidad) {
        return response.status(422).json({ message: "Por favor enviar la cantidad"});
    }
    if(isNaN(request.body.cantidad)) {
        return response.status(422).json({ message: "La cantidad debe ser numérica"});
    }
    next();
}

const validUpdate = async (request, response, next) => {
    if(isNaN(request.params.equipoId)) {
        return response.status(422).json({ message: "El id de equipo a modificar debe ser numérico"});
    }
    const validacion = await consultar(request.params.equipoId);
    if(!validacion) {
        return response.status(404).json({ message: "El equipo a modificar no existe"});
    }
    
    if(!request.body.nombre || request.body.nombre.trim() == "") {
        return response.status(422).json({ message: "Por favor enviar el nombre"});
    }
    if(!request.body.marca || request.body.marca.trim() == "") {
        return response.status(422).json({ message: "Por favor enviar la marca"});
    }
    if(!request.body.cantidad) {
        return response.status(422).json({ message: "Por favor enviar la cantidad"});
    }
    if(isNaN(request.body.cantidad)) {
        return response.status(422).json({ message: "La cantidad debe ser numérica"});
    }
    next();
}

const validDelete = async(request, response, next) => {
    if(isNaN(request.params.id)) {
        return response.status(422).json({ message: "El id de equipo a eliminar debe ser numérico"});
    }
    const validacion = await consultar(request.params.id);
    if(!validacion) {
        return response.status(404).json({ message: "El equipo a eliminar no existe"});
    }
    next();
}

// Listado de equipos
app.get("/equipos", (request, response) => {
    listar().then(listado => {
        response.json({ message: "Listado de equipos registrados", data: listado })
    });
});

// registro de equipos
app.post("/equipos", validRegister, async (request, response) => {
    // OK*** Validar que se reciba por el body el nombre, la marca y la cantidad de lo contrario devolver code 422.
    const { nombre, marca, cantidad } = request.body;
    const equipo = await registrar(nombre, marca, cantidad);
    response.status(equipo.code).json({ message: equipo.message, data: equipo.registros || null });
});

// Modificación de equipos
app.put("/equipos/:equipoId", validUpdate, async (request, response) => {
    // OK *** Validar que se reciba por el body el nombre, la marca y la cantidad de lo contrario devolver code 422.
    // OK ***Validar que el equipoId exista, en caso de no existir devolver código 404 y un message.
    const { nombre, marca, cantidad } = request.body
    const equipo = await modificar(request.params.equipoId, nombre, marca, cantidad);
    response.status(equipo.code).json({ message: equipo.message, data: equipo.actualizado || null});
});

// Eliminación de equipos.
app.delete("/equipos/:id", validDelete, async (request, response) => {
    // Validar que el equipoId exista, en caso de no existir devolver código 404 y un message.
    const equipo = await eliminar(request.params.id);
    response.status(equipo.code).json({ message: equipo.message, data: equipo.eliminado || null })
})

