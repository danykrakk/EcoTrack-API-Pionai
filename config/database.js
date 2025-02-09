const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("🔥 Conectado ao banco de dados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
  }
}

testConnection();

module.exports = sequelize;
