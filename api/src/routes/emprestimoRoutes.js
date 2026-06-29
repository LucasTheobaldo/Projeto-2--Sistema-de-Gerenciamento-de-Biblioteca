const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const {permitir, PAPEIS} = require('../middlewares/papelMiddleware');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /emprestimo:
 *   post:
 *     summary: Registra um novo empréstimo
 *     tags: [Empréstimos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [leitorId, livroId, data_retorno]
 *             properties:
 *               leitorId: { type: integer, example: 1 }
 *               livroId: { type: integer, example: 1 }
 *               data_retorno: { type: string, format: date, example: '2026-07-15' }
 *     responses:
 *       201:
 *         description: Empréstimo registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Emprestimo' }
 *       404:
 *         description: Leitor ou livro não encontrado
 *       409:
 *         description: Leitor inativo ou livro sem exemplares disponíveis
 */
router.post('/emprestimo',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    emprestimoController.create
);

/**
 * @swagger
 * /emprestimo:
 *   get:
 *     summary: Lista empréstimos (Leitor vê apenas os próprios)
 *     tags: [Empréstimos]
 *     responses:
 *       200:
 *         description: Lista de empréstimos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Emprestimo' }
 */
router.get('/emprestimo',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO, PAPEIS.LEITOR),
    emprestimoController.list
);

/**
 * @swagger
 * /emprestimo/buscar:
 *   get:
 *     summary: Busca empréstimos por status, leitor ou data
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: integer, description: '1=Em aberto, 2=Devolvido, 3=Atrasado' }
 *       - in: query
 *         name: leitorId
 *         schema: { type: integer }
 *       - in: query
 *         name: data
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Empréstimos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Emprestimo' }
 */
router.get('/emprestimo/buscar',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    emprestimoController.search
);

/**
 * @swagger
 * /emprestimo/{id}/devolver:
 *   patch:
 *     summary: Registra a devolução de um empréstimo
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Devolução registrada
 *       404:
 *         description: Empréstimo não encontrado
 *       409:
 *         description: Empréstimo já foi devolvido
 */
router.patch('/emprestimo/:id/devolver',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    emprestimoController.devolver
);

/**
 * @swagger
 * /emprestimo/{id}:
 *   get:
 *     summary: Busca um empréstimo pelo ID (Leitor só acessa o próprio)
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Empréstimo encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Emprestimo' }
 *       404:
 *         description: Empréstimo não encontrado
 */
router.get('/emprestimo/:id',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO, PAPEIS.LEITOR),
    emprestimoController.getById
);

/**
 * @swagger
 * /emprestimo/{id}:
 *   delete:
 *     summary: Remove um registro de empréstimo (somente Administrador; exige devolução prévia)
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Empréstimo removido
 *       404:
 *         description: Empréstimo não encontrado
 *       409:
 *         description: Empréstimo em aberto ou atrasado não pode ser excluído
 */
router.delete('/emprestimo/:id',
    auth,
    permitir(PAPEIS.ADMIN),
    emprestimoController.delete
);

module.exports = router;