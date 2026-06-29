const bcrypt = require('bcryptjs');
const db = require('../config/db_sequelize');

module.exports = {
    async create(req, res) {
        try {
            const {login, senha, papel} = req.body;

            if (!login || !senha) {
                return res.status(400).json({erro: 'Login e senha são obrigatórios'});
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            const usuario = await db.Usuario.create({
                login: login.trim(),
                senha: senhaHash,
                papel: papel || 3
            });

            res.status(201).json({
                id: usuario.id,
                login: usuario.login,
                papel: usuario.papel
            });
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            res.status(500).json({erro: 'Erro ao criar usuário'});
        }
    },

    async list(req, res) {
        const usuarios = await db.Usuario.findAll({
            attributes: ['id', 'login', 'papel']
        });
        res.status(200).json(usuarios);
    },

    async getById(req, res) {
        const usuario = await db.Usuario.findByPk(req.params.id, {
            attributes: ['id', 'login', 'papel']
        });
        if (!usuario)
            return res.status(404).json({erro: 'Usuário não encontrado'});
        res.status(200).json(usuario);
    },

    async update(req, res) {
        try {
            const {login, senha, papel} = req.body;
            const dados = {};

            if (login) dados.login = login.trim();
            if (papel) dados.papel = papel;
            if (senha) dados.senha = await bcrypt.hash(senha, 10);

            const [linhasAfetadas] = await db.Usuario.update(dados, {
                where: {id: req.params.id}
            });

            if (!linhasAfetadas)
                return res.status(404).json({erro: 'Usuário não encontrado'});
            res.status(200).json({mensagem: 'Usuário atualizado'});
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            res.status(500).json({erro: 'Erro ao atualizar usuário'});
        }
    },

    async delete(req, res) {
        const linhasAfetadas = await db.Usuario.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!linhasAfetadas)
            return res.status(404).json({erro: 'Usuário não encontrado'});
        res.status(200).json({mensagem: 'Usuário removido'});
    }
}
