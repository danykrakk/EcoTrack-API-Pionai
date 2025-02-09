const sequelize = require("./config/database");
const Action = require("./models/action");
const User = require("./models/user");

async function syncDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco bem-sucedida!");

    await sequelize.sync({ force: true }); // ⚠️ Isso APAGA e RECRIA tabelas
    console.log("✅ Banco de dados sincronizado!");

    process.exit();
  } catch (error) {
    console.error("❌ Erro ao sincronizar o banco:", error);
    process.exit(1);
  }
}

syncDB();
