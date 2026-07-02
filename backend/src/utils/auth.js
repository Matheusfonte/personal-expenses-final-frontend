const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hash de senha com bcrypt
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Comparar senha com hash
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Gerar token JWT
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
}

// Verificar token JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
