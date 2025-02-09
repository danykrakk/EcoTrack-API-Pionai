const express = require('express');
const { generateToken } = require('../utils/jwt');
const router = express.Router();

// Rota de login falso (simula um usuário autenticado)
router.post('/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email obrigatório!' });
  }

  // Simula um usuário
  const user = { id: 1, email };

  // Gera o token
  const token = generateToken(user);

  res.json({ message: 'Login bem-sucedido!', token });
});

module.exports = router;
