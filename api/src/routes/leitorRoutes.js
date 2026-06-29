const express = require('express');
const router = express.Router();
const leitorController = require('../controllers/leitorController');
const {permitir, PAPEIS} = require('../middlewares/papelMiddleware');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /leitor:
 *   post:
 *     summary: Cadastra um novo leitor (cria Usuario + Leitor vinculados)
 *     tags: [Leitores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, senha, nome, cadastro]
 *             properties:
 *               login: { type: string, example: alunoC }
 *               senha: { type: string, example: "1234" }
 *               nome: { type: string, example: Aluno C }
 *               cadastro: { type: string, description: 'CPF ou RA', example: '33333333333' }
 *               email: { type: string, example: alunoc@teste.com }
 *               telefone: { type: string, example: '43900000003' }
 *               endereco: { type: string, example: 'Rua Teste, 3' }
 *     responses:
 *       201:
 *         description: Leitor criado
 *       400:
 *         description: Login, senha, nome e CPF/RA são obrigatórios
 */
router.post('/leitor',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    leitorController.create
);

/**
 * @swagger
 * /leitor:
 *   get:
 *     summary: Lista todos os leitores
 *     tags: [Leitores]
 *     responses:
 *       200:
 *         description: Lista de leitores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Leitor' }
 */
router.get('/leitor',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    leitorController.list
);

/**
 * @swagger
 * /leitor/buscar:
 *   get:
 *     summary: Busca leitor por nome ou CPF/RA
 *     tags: [Leitores]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         description: Termo de busca (nome ou CPF/RA)
 *     responses:
 *       200:
 *         description: Leitores encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Leitor' }
 *       400:
 *         description: Termo de busca não informado
 */
router.get('/leitor/buscar',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    leitorController.search
);

/**
 * @swagger
 * /leitor/{id}/inativar:
 *   patch:
 *     summary: Inativa um leitor (impede novos empréstimos)
 *     tags: [Leitores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Leitor inativado
 *       404:
 *         description: Leitor não encontrado
 */
router.patch('/leitor/:id/inativar',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    leitorController.inativar
);

/**
 * @swagger
 * /leitor/{id}:
 *   get:
 *     summary: Busca um leitor pelo ID
 *     tags: [Leitores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Leitor encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Leitor' }
 *       404:
 *         description: Leitor não encontrado
 */
router.get('/leitor/:id',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    leitorController.getById
);

/**
 * @swagger
 * /leitor/{id}:
 *   put:
 *     summary: Atualiza dados de um leitor
 *     tags: [Leitores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Leitor' }
 *     responses:
 *       200:
 *         description: Leitor atualizado
 *       404:
 *         description: Leitor não encontrado
 */
router.put('/leitor/:id',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    leitorController.update
);

/**
 * @swagger
 * /leitor/{id}:
 *   delete:
 *     summary: Remove um leitor (somente Administrador; bloqueado se houver empréstimo em aberto ou atrasado)
 *     tags: [Leitores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Leitor removido
 *       404:
 *         description: Leitor não encontrado
 *       409:
 *         description: Leitor possui empréstimo em aberto ou atrasado
 */
router.delete('/leitor/:id',
    auth,
    permitir(PAPEIS.ADMIN),
    leitorController.delete
);

module.exports = router;