const express = require("express");
const { listar, registrar, modificar, eliminar } = require("./funciones/equipos/consultas.js");
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => { 
    console.log(`Aplicación ejecutándose por el puerto ${port}`);
});

app.get("/equipos", (request, response) => {
    listar().then(listado => {
        response.json({ message: "Listado de equipos registrados", data: listado })
    });
});

app.post("/equipos", async (request, response) => {
    // Validar que se reciba por el body el nombre, la marca y la cantidad de lo contrario devolver code 422.
    const { nombre, marca, cantidad } = request.body;
    const equipo = await registrar(nombre, marca, cantidad);
    response.status(equipo.code).json({ message: equipo.message, data: equipo.registros || null });
});

app.put("/equipos/:equipoId", async (request, response) => {
    // Validar que se reciba por el body el nombre, la marca y la cantidad de lo contrario devolver code 422.
    // Validar que el equipoId exista, en caso de no existir devolver código 404 y un message.
    const { nombre, marca, cantidad } = request.body
    const equipo = await modificar(request.params.equipoId, nombre, marca, cantidad);
    response.status(equipo.code).json({ message: equipo.message, data: equipo.actualizado || null});
});

app.delete("/equipos/:id", async (request, response) => {
    // Validar que el equipoId exista, en caso de no existir devolver código 404 y un message.
    const equipo = await eliminar(request.params.id);
    response.status(equipo.code).json({ message: equipo.message, data: equipo.eliminado || null })
})

