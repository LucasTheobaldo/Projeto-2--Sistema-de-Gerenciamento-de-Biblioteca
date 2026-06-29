const db = require('../config/db_sequelize');
const {Op} = require('sequelize');

module.exports = {
    async create(req, res) {
        try {
            const {titulo, autor, editora, publicacao, categoria, isbn, total, disponivel, status} = req.body;

            if (!titulo || !isbn || !total) {
                return res.status(400).json({erro: 'Título, ISBN e quantidade total são obrigatórios'});
            }

            const livro = await db.Livro.create({
                titulo: titulo,
                autor: autor,
                editora: editora,
                publicacao: publicacao,
                categoria: categoria,
                isbn: isbn,
                total: total,
                disponivel: disponivel ?? total,
                status: status ?? true
            });

            res.status(201).json(livro);
        } catch (err) {
            console.error('Erro ao criar livro:', err);
            res.status(500).json({erro: 'Erro ao criar livro'});
        }
    },

    async list(req, res) {
        const livros = await db.Livro.findAll({
            attributes: ['titulo', 'autor', 'editora', 'publicacao', 'categoria', 'isbn', 'total', 'disponivel', 'status']
        });
        res.status(200).json(livros);
    },

    async getById(req, res) {
        const livro = await db.Livro.findByPk(req.params.id, {
            attributes: ['id', 'titulo', 'autor', 'editora', 'publicacao', 'categoria', 'isbn', 'total', 'disponivel', 'status']
        });
        if (!livro)
            return res.status(404).json({erro: 'Livro não encontrado'});
        res.status(200).json(livro);
    },

    async search(req, res) {
        const {titulo, autor, categoria, disponivel} = req.query;
        const where = {};

        if (titulo) where.titulo = {[Op.iLike]: `%${titulo}%`};
        if (autor) where.autor = {[Op.iLike]: `%${autor}%`};
        if (categoria) where.categoria = {[Op.iLike]: `%${categoria}%`};
        if (disponivel !== undefined) where.disponivel = {[Op.gt]: 0};

        const livros = await db.Livro.findAll({where});
        res.status(200).json(livros);
    },

    async update(req, res) {
        try {
            const {titulo, autor, editora, publicacao, categoria, isbn, total, disponivel, status} = req.body;
            const dados = {};

            if (titulo) dados.titulo = titulo;
            if (autor) dados.autor = autor;
            if (editora) dados.editora = editora;
            if (publicacao) dados.publicacao = publicacao;
            if (categoria) dados.categoria = categoria;
            if (isbn) dados.isbn = isbn;
            if (total) dados.total = total;
            if (disponivel) dados.disponivel = disponivel;
            if (status) dados.status = status;

            const [linhasAfetadas] = await db.Livro.update(dados, {
                where: {id: req.params.id}
            });

            if (!linhasAfetadas)
                return res.status(404).json({erro: 'Livro não encontrado'});
            res.status(200).json({mensagem: 'Livro atualizado'});
        } catch (err) {
            console.error('Erro ao atualizar livro:', err);
            res.status(500).json({erro: 'Erro ao atualizar livro'});
        }
    },

    async delete(req, res) {
        const linhasAfetadas = await db.Livro.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!linhasAfetadas)
            return res.status(404).json({erro: 'Livro não encontrado'});
        res.status(200).json({mensagem: 'Livro removido'});
    }
}
