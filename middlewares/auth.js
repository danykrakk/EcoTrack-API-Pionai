const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-super-segura';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Cabeçalho de autorização recebido:", authHeader); // Debug

  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado! Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // Espera "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Formato do token inválido!' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Token decodificado:", decoded); // Debug
    req.user = decoded; // Adiciona dados do usuário ao request
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error.message);
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};
