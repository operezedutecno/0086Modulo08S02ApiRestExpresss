const { Pool } = require("pg");

const conexion = new Pool({
    host: "localhost",
    port: 5432,
    database: 'gestionequipos',
    user: 'postgres',
    password: 'postgres'
});

module.exports = conexion;