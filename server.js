const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const authRoutes = require("./routes/auth");
const actionRoutes = require("./routes/actions");
const { verifyToken } = require("./utils/jwt");
const sequelize = require("./database"); // Importando o banco de dados
require("dotenv").config(); // Carregar variáveis de ambiente

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Carregar o arquivo Swagger
const swaggerDocument = YAML.load("./swagger.yaml");

// Usar o Swagger para documentar a API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota raiz
app.get("/", (req, res) => {
  res.send("🚀 API funcionando!");
});

// Registrar as rotas de autenticação
app.use("/auth", authRoutes);

// Registrar as rotas de ações
app.use("/actions", actionRoutes);

// Rota protegida de teste
app.get("/private", verifyToken, (req, res) => {
  res.json({ message: "✅ Acesso permitido!", user: req.user });
});

// Sincronizar o banco de dados e iniciar o servidor
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conexão com o banco de dados bem-sucedida!");
    return sequelize.sync(); // Cria tabelas automaticamente se ainda não existirem
  })
  .then(() => {
    console.log("✅ Banco de dados sincronizado!");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });

    // Tratar erro de porta ocupada
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        const newPort = PORT + 1;
        console.error(`⚠️ Porta ${PORT} já está em uso. Tentando porta ${newPort}...`);
        app.listen(newPort, () => {
          console.log(`🚀 Servidor rodando em http://localhost:${newPort}`);
        });
      } else {
        console.error("❌ Erro ao iniciar o servidor:", err);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
  });
