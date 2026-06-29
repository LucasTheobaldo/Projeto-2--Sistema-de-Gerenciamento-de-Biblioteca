const db = require('../config/db_sequelize');
const {Op} = require('sequelize');
const {PAPEIS} = require('../middlewares/papelMiddleware');
const atualizarAtrasados = require('../utils/atualizarAtrasados');

const STATUS_EMPRESTIMO = {
    EM_ABERTO: 1,
    DEVOLVIDO: 2,
    ATRASADO: 3
};

module.exports = {
    async create(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const {leitorId, livroId, data_retorno} = req.body;

            if (!leitorId || !livroId || !data_retorno) {
                await t.rollback();
                return res.status(400).json({erro: 'leitorId, livroId e data_retorno são obrigatórios'});
            }

            const leitor = await db.Leitor.findByPk(leitorId, {transaction: t});
            if (!leitor) {
                await t.rollback();
                return res.status(404).json({erro: 'Leitor não encontrado'});
            }
            if (!leitor.status) {
                await t.rollback();
                return res.status(409).json({erro: 'Leitor inativo não pode realizar empréstimo'});
            }

            const livro = await db.Livro.findByPk(livroId, {transaction: t});
            if (!livro) {
                await t.rollback();
                return res.status(404).json({erro: 'Livro não encontrado'});
            }
            if (livro.disponivel <= 0) {
                await t.rollback();
                return res.status(409).json({erro: 'Livro sem exemplares disponíveis'});
            }

            const emprestimo = await db.Emprestimo.create({
                leitorId,
                livroId,
                data_emprestimo: new Date(),
                data_retorno,
                status: STATUS_EMPRESTIMO.EM_ABERTO
            }, {transaction: t});

            livro.disponivel -= 1;
            if (livro.disponivel === 0) livro.status = false;
            await livro.save({transaction: t});

            await t.commit();
            res.status(201).json(emprestimo);
        } catch (err) {
            await t.rollback();
            console.error('Erro ao registrar empréstimo:', err);
            res.status(500).json({erro: 'Erro ao registrar empréstimo'});
        }
    },

    async devolver(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const emprestimo = await db.Emprestimo.findByPk(req.params.id, {transaction: t});

            if (!emprestimo) {
                await t.rollback();
                return res.status(404).json({erro: 'Empréstimo não encontrado'});
            }
            if (emprestimo.status === STATUS_EMPRESTIMO.DEVOLVIDO) {
                await t.rollback();
                return res.status(409).json({erro: 'Empréstimo já foi devolvido'});
            }

            emprestimo.data_devolucao = new Date();
            emprestimo.status = STATUS_EMPRESTIMO.DEVOLVIDO;
            await emprestimo.save({transaction: t});

            const livro = await db.Livro.findByPk(emprestimo.livroId, {transaction: t});
            livro.disponivel += 1;
            livro.status = true;
            await livro.save({transaction: t});

            await t.commit();
            res.status(200).json({mensagem: 'Devolução registrada', emprestimo});
        } catch (err) {
            await t.rollback();
            console.error('Erro ao registrar devolução:', err);
            res.status(500).json({erro: 'Erro ao registrar devolução'});
        }
    },

    async list(req, res) {
        await atualizarAtrasados(db);
        const where = {};
        if (req.usuario.papel === PAPEIS.LEITOR) {
            where.leitorId = req.usuario.id;
        }

        const emprestimos = await db.Emprestimo.findAll({
            where,
            include: [
                {model: db.Leitor, as: 'leitor', attributes: ['id', 'nome']},
                {model: db.Livro, as: 'livro', attributes: ['id', 'titulo']}
            ]
        });
        res.status(200).json(emprestimos);
    },

    async getById(req, res) {
        const where = {id: req.params.id};

        if (req.usuario.papel === PAPEIS.LEITOR) {
            where.leitorId = req.usuario.id;
        }

        const emprestimo = await db.Emprestimo.findOne({
            where,
            include: [
                {model: db.Leitor, as: 'leitor', attributes: ['id', 'nome']},
                {model: db.Livro, as: 'livro', attributes: ['id', 'titulo']}
            ]
        });

        if (!emprestimo) return res.status(404).json({erro: 'Empréstimo não encontrado'});
        res.status(200).json(emprestimo);
    },

    async search(req, res) {
        await atualizarAtrasados(db);
        const {status, leitorId, data} = req.query;
        const where = {};

        if (status) where.status = status;
        if (leitorId) where.leitorId = leitorId;
        if (data) where.data_emprestimo = {[Op.gte]: new Date(data)};

        const emprestimos = await db.Emprestimo.findAll({where});
        res.status(200).json(emprestimos);
    },

    async delete(req, res) {
        try {
            const emprestimo = await db.Emprestimo.findByPk(req.params.id);

            if (!emprestimo) return res.status(404).json({erro: 'Empréstimo não encontrado'});

            if (emprestimo.status !== STATUS_EMPRESTIMO.DEVOLVIDO) {
                return res.status(409).json({
                    erro: 'Empréstimo em aberto ou atrasado não pode ser excluído — registre a devolução primeiro'
                });
            }

            await db.Emprestimo.destroy({where: {id: req.params.id}});
            res.status(200).json({mensagem: 'Empréstimo removido'});
        } catch (err) {
            console.error('Erro ao excluir empréstimo:', err);
            res.status(500).json({erro: 'Erro ao excluir empréstimo'});
        }
    }
}