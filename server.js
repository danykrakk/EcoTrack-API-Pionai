const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/auth');
const actionRoutes = require('./routes/actions'); // Adicionando as rotas de ações
const { verifyToken } = require('./utils/jwt'); // Importando o middleware para verificar o JWT

const app = express();

// Middleware para processar JSON
app.use(bodyParser.json());

// Carregar o arquivo Swagger
const swaggerDocument = YAML.load('./swagger.yaml');

// Usar o Swagger para documentar a API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota raiz
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Registrar as rotas de autenticação
app.use('/auth', authRoutes);

// Registrar as rotas de ações
app.use('/actions', actionRoutes); // <=== Adicionada as rotas de ações

// Rota protegida de teste
app.get('/private', verifyToken, (req, res) => {
  res.json({ message: 'Acesso permitido!', user: req.user });
});

// Definir porta dinâmica
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// Tratar erro de porta ocupada
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Porta ${PORT} já está em uso. Tentando outra porta...`);
    const newPort = PORT + 1;
    app.listen(newPort, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${newPort}`);
    });
  } else {
    console.error('Erro ao iniciar o servidor:', err);
  }
});
