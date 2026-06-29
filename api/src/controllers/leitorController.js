const bcrypt = require('bcryptjs');
const db = require('../config/db_sequelize');
const {Op} = require('sequelize');

const STATUS_EMPRESTIMO = {
    EM_ABERTO: 1,
    DEVOLVIDO: 2,
    ATRASADO: 3
};

module.exports = {
    async create(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const {login, senha, nome, cadastro, email, telefone, endereco} = req.body;

            if (!login || !senha || !nome || !cadastro) {
                await t.rollback();
                return res.status(400).json({erro: 'Login, senha, nome e CPF/RA são obrigatórios'});
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            const usuario = await db.Usuario.create({
                login: login.trim(),
                senha: senhaHash,
                papel: 3
            }, {transaction: t});

            const leitor = await db.Leitor.create({
                usuarioId: usuario.id,
                nome,
                cadastro,
                email,
                telefone,
                endereco,
                status: true
            }, {transaction: t});

            await t.commit();

            res.status(201).json({
                id: leitor.id,
                nome: leitor.nome,
                cadastro: leitor.cadastro,
                email: leitor.email,
                usuario: {id: usuario.id, login: usuario.login}
            });
        } catch (err) {
            await t.rollback();
            console.error('Erro ao criar leitor:', err);
            res.status(500).json({erro: 'Erro ao criar leitor'});
        }
    },

    async list(req, res) {
        const leitores = await db.Leitor.findAll({
            include: [{model: db.Usuario, as: 'usuario', attributes: ['id', 'login']}]
        });
        res.status(200).json(leitores);
    },

    async getById(req, res) {
        const leitor = await db.Leitor.findByPk(req.params.id, {
            include: [{model: db.Usuario, as: 'usuario', attributes: ['id', 'login']}]
        });
        if (!leitor) return res.status(404).json({erro: 'Leitor não encontrado'});
        res.status(200).json(leitor);
    },

    async search(req, res) {
        const {q} = req.query;
        if (!q) return res.status(400).json({erro: 'Informe um termo de busca (?q=)'});

        const leitores = await db.Leitor.findAll({
            where: {
                [Op.or]: [
                    {nome: {[Op.iLike]: `%${q}%`}},
                    {cadastro: {[Op.iLike]: `%${q}%`}}
                ]
            }
        });
        res.status(200).json(leitores);
    },

    async update(req, res) {
        try {
            const {nome, cadastro, email, telefone, endereco, status} = req.body;
            const dados = {};

            if (nome) dados.nome = nome;
            if (cadastro) dados.cadastro = cadastro;
            if (email) dados.email = email;
            if (telefone) dados.telefone = telefone;
            if (endereco) dados.endereco = endereco;
            if (status !== undefined) dados.status = status;

            const [linhasAfetadas] = await db.Leitor.update(dados, {
                where: {id: req.params.id}
            });

            if (!linhasAfetadas) return res.status(404).json({
                erro: 'Leitor não encontrado'
            });
            res.status(200).json({mensagem: 'Leitor atualizado'});
        } catch (err) {
            console.error('Erro ao atualizar leitor:', err);
            res.status(500).json({erro: 'Erro ao atualizar leitor'});
        }
    },

    async delete(req, res) {
        try {
            const emprestimoAtivo = await db.Emprestimo.findOne({
                where: {
                    leitorId: req.params.id,
                    status: {[Op.ne]: STATUS_EMPRESTIMO.DEVOLVIDO}
                }
            });

            if (emprestimoAtivo) {
                return res.status(409).json({
                    erro: 'Leitor possui empréstimo em aberto ou atrasado e não pode ser excluído'
                });
            }

            const linhasAfetadas = await db.Leitor.destroy({where: {id: req.params.id}});

            if (!linhasAfetadas) return res.status(404).json({
                erro: 'Leitor não encontrado'
            });
            res.status(200).json({mensagem: 'Leitor removido'});
        } catch (err) {
            console.error('Erro ao excluir leitor:', err);
            res.status(500).json({erro: 'Erro ao excluir leitor'});
        }
    },

    async inativar(req, res) {
        const [linhasAfetadas] = await db.Leitor.update(
            {status: false},
            {where: {id: req.params.id}}
        );
        if (!linhasAfetadas) return res.status(404).json({
            erro: 'Leitor não encontrado'
        });
        res.status(200).json({mensagem: 'Leitor inativado'});
    }
}