const express = require("express");
const { v4: uuid} = require("uuid");
const app = express();
const port = 3000;

app.use(express.json());

const listadoEquipos = [];

app.listen(port, () => { 
    console.log(`Aplicación ejecutándose por el puerto ${port}`);
});

app.get("/equipos", (request, response) => {
    // console.log({query: request.query, body: request.body });
    // response.send("Listado") //Respuesta text/html
    response.json({ message: "Listado de equipos", data: listadoEquipos}); // Respuesta application/json
});

app.post("/equipos", (request, response) => {
    // console.log(request.body);
    // Contemplar aumentar la cantidad de dispositivos si incluyen uno repetido.
    const { nombre, marca } = request.body;

    const repetido = listadoEquipos.some(
        item => item.nombre.toLowerCase() == nombre.toLowerCase() && 
        item.marca.toLowerCase() == marca.toLowerCase()
    );

    if(repetido) {
        return response.status(409).json({ message: "Equipo registrado previamente"});
    }
    const equipo = { nombre, marca, id: uuid()};
    listadoEquipos.push(equipo)
    response.json({ message: "Registro de equipos exitoso", data: equipo });
});

app.put("/equipos/:equipoId", (request, response) => {
    let equipo = listadoEquipos.find(item => item.id == request.params.equipoId)
    if(!equipo) {
        return response.status(404).json({ message: "El Id de equipo no existe en nuestros registros"});
    }
    equipo.nombre = request.body.nombre;
    equipo.marca = request.body.marca;
    response.json({ message: "Equipo modificado exitosamente", data: equipo });
});

app.delete("/equipos/:id", (request, response) => {
    const indice = listadoEquipos.findIndex(item => item.id == request.params.id);
    if(indice == -1) {
        return response.status(404).json({ message: "El Id de equipo no existe en nuestros registros"});
    }
    const equipoEliminado = listadoEquipos[indice]; 
    listadoEquipos.splice(indice, 1);
    response.json({ message: "Equipo eliminado con éxito", data: equipoEliminado});
})

