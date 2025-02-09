const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-super-segura'; // Usa variável de ambiente ou valor fixo

module.exports = {
  generateToken: (user) => {
    return jwt.sign(
      { id: user.id, email: user.email }, // Payload do token
      SECRET_KEY,
      { expiresIn: '24h' } // Tempo de expiração
    );
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return null;
    }
  }
};
