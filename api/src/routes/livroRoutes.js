const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const {permitir, PAPEIS} = require('../middlewares/papelMiddleware');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Cadastra um novo livro
 *     tags: [Livros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, isbn, total]
 *             properties:
 *               titulo: { type: string, example: Dom Casmurro }
 *               autor: { type: string, example: Machado de Assis }
 *               editora: { type: string, example: Garnier }
 *               publicacao: { type: string, format: date, example: '1899-01-01' }
 *               categoria: { type: string, example: Romance }
 *               isbn: { type: string, example: '9788535910664' }
 *               total: { type: integer, example: 3 }
 *               disponivel: { type: integer, example: 3 }
 *               status: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Livro criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Livro' }
 *       400:
 *         description: Título, ISBN e quantidade total são obrigatórios
 */
router.post('/livros',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    livroController.create
);

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     tags: [Livros]
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Livro' }
 */
router.get('/livros',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO, PAPEIS.LEITOR),
    livroController.list
);

/**
 * @swagger
 * /livros/buscar:
 *   get:
 *     summary: Busca livros por título, autor, categoria ou disponibilidade
 *     tags: [Livros]
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema: { type: string }
 *       - in: query
 *         name: autor
 *         schema: { type: string }
 *       - in: query
 *         name: categoria
 *         schema: { type: string }
 *       - in: query
 *         name: disponivel
 *         description: Se presente, filtra apenas livros com exemplares disponíveis
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista de livros filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Livro' }
 */
router.get('/livros/buscar',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO, PAPEIS.LEITOR),
    livroController.search
);

/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Busca um livro pelo ID
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Livro encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Livro' }
 *       404:
 *         description: Livro não encontrado
 */
router.get('/livros/:id',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO, PAPEIS.LEITOR),
    livroController.getById
);

/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza dados de um livro
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Livro' }
 *     responses:
 *       200:
 *         description: Livro atualizado
 *       404:
 *         description: Livro não encontrado
 */
router.put('/livros/:id',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    livroController.update
);

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Remove um livro (somente Administrador)
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Livro removido
 *       404:
 *         description: Livro não encontrado
 */
router.delete('/livros/:id',
    auth,
    permitir(PAPEIS.ADMIN),
    livroController.delete
);

module.exports = router;