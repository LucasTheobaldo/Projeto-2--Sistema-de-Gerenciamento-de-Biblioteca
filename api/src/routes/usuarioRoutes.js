const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {permitir, PAPEIS} = require('../middlewares/papelMiddleware');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Cadastra um novo usuário do sistema (Administrador ou Bibliotecário)
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, senha]
 *             properties:
 *               login: { type: string, example: biblio }
 *               senha: { type: string, example: "1234" }
 *               papel: { type: integer, description: '1=Administrador, 2=Bibliotecário, 3=Leitor', example: 2 }
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       400:
 *         description: Campos obrigatórios não preenchidos
 *       403:
 *         description: Sem permissão (somente Administrador)
 */
router.post('/usuario',
    auth,
    permitir(PAPEIS.ADMIN),
    usuarioController.create
);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários do sistema
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Usuario' }
 */
router.get('/usuarios',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    usuarioController.list
);

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/usuario/:id',
    auth,
    permitir(PAPEIS.ADMIN, PAPEIS.BIBLIOTECARIO),
    usuarioController.getById
);

/**
 * @swagger
 * /usuario/{id}:
 *   put:
 *     summary: Atualiza dados de um usuário (somente Administrador)
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login: { type: string }
 *               senha: { type: string }
 *               papel: { type: integer }
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/usuario/:id',
    auth,
    permitir(PAPEIS.ADMIN),
    usuarioController.update
);

/**
 * @swagger
 * /usuario/{id}:
 *   delete:
 *     summary: Remove um usuário (somente Administrador)
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Usuário removido
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/usuario/:id',
    auth,
    permitir(PAPEIS.ADMIN),
    usuarioController.delete
);

module.exports = router;