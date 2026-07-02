const { User } = require('../models');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

async function register(req, res, next) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: 'Nome, email e senha sao obrigatorios',
      });
    }

    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: 'Email ja cadastrado',
      });
    }

    const senhaHash = await hashPassword(senha);
    const usuario = await User.create({
      nome,
      email,
      senha: senhaHash,
    });

    const token = generateToken(usuario.id);

    res.status(201).json({
      mensagem: 'Usuario cadastrado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'Email e senha sao obrigatorios',
      });
    }

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({
        mensagem: 'Email ou senha invalidos',
      });
    }

    const senhaValida = await comparePassword(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({
        mensagem: 'Email ou senha invalidos',
      });
    }

    const token = generateToken(usuario.id);

    res.json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
