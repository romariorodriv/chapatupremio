const { Pool } = require("pg");
require("dotenv").config();

//Crea una nueva instancia de Pool con la configuracipon de la base de datos
const pool = new Pool({
    user: process.env.DB_USER, //Usuario de la base de datos
    host: process.env.DB_HOST, //Host de la base de datos
    database: process.env.DB_NAME, //Nombre de la base de datos
    password: process.env.DB_PASSWORD,//Contraseña del usuario de la base de datos
    port: process.env.DB_PORT, // Puerto en el que escucha la base de datos
});

//Establece una conexion con la base de datos
pool.connect()
    .then(() => console.log("📌 Conectado a PostgreSQL"))
    .catch(err => console.error("❌ Error conectando a PostgreSQL", err));

    //Exporta la instancia de Pool para que pueda ser utilizada en otros módulos
module.exports = pool;
