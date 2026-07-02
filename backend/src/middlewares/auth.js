const { verifyToken } = require('../utils/auth');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      mensagem: 'Token de autenticacao ausente',
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({
      mensagem: 'Token invalido ou expirado',
    });
  }

  req.usuario = decoded;
  next();
}

function errorHandler(err, req, res, next) {
  console.error('Erro:', err);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      mensagem: 'Registro ja cadastrado',
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      mensagem: 'Erro de validacao',
      erros: err.errors.map((error) => error.message),
    });
  }

  res.status(err.status || 500).json({
    mensagem: err.mensagem || err.message || 'Erro interno do servidor',
    erro: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = {
  authenticateToken,
  errorHandler,
};
