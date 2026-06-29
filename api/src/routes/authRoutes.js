const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna o token JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, senha]
 *             properties:
 *               login: { type: string, example: admin }
 *               senha: { type: string, example: "1234" }
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 usuario: { $ref: '#/components/schemas/Usuario' }
 *       401:
 *         description: Login ou senha inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Erro' }
 */

router.post('/login', authController.login);

module.exports = router;