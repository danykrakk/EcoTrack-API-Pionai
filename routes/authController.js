const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { Pool } = require('pg'); // Conexão com o banco de dados

const router = express.Router();
const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'eco_track',
  password: 'sua_senha',
  port: 5432, // Porta do PostgreSQL
});

// Rota de login real
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
  }

  try {
    // Buscar usuário no banco de dados
    const result = await pool.query('SELECT * FROM "Users" WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado!' });
    }

    const user = result.rows[0];

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta!' });
    }

    // Gerar token JWT
    const token = generateToken({ id: user.id, email: user.email });

    res.json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor!' });
  }
});

module.exports = router;
