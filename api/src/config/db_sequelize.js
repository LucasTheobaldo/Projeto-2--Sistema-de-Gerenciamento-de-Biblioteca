require('dotenv').config();
const Sequelize = require('sequelize');
console.log('DB_PASS:', process.env.DB_PASS, typeof process.env.DB_PASS);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres'
    }
);

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models
db.Usuario = require("../models/usuario.js")(sequelize, Sequelize);
db.Leitor = require("../models/leitor.js")(sequelize, Sequelize);
db.Livro = require("../models/livro.js")(sequelize, Sequelize);
db.Emprestimo = require("../models/emprestimo.js")(sequelize, Sequelize);

//Relacionamentos
require("../models/index.js")(db);

module.exports = db;
