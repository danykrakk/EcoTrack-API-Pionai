const { Sequelize } = require("sequelize");
require('dotenv').config();

// URL do banco vinda de uma variável de ambiente ou diretamente no código
const dbUrl = process.env.DATABASE_URL || "postgresql://ecotrack_db_jns2_user:rdNM1HFZPjWNEVXhRfX25TVDHU5qEjpR@dpg-cuk866l6l47c73c90530-a.oregon-postgres.render.com/ecotrack_db_jns2";

// Extraindo o host, o usuário, a senha e o banco de dados da URL
const url = new URL(dbUrl.replace("postgresql://", "http://")); // Substitui prefixo para evitar erro
const host = url.hostname;
const user = url.username;
const password = url.password;
const database = url.pathname.split('/')[1]; // Extrai o nome do banco de dados da URL

// Criando conexão Sequelize com os parâmetros extraídos
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Para evitar erro de certificado
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
