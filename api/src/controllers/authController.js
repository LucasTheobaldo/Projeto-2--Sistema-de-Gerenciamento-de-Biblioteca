const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db_sequelize');

module.exports = {
    async login(req, res) {
        try {
            const {login, senha} = req.body;

            const usuario = await db.Usuario.findOne({where: {login}});

            if (!usuario) {
                return res.status(401).json({erro: 'Login ou senha inválidos'});
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({erro: 'Login ou senha inválidos'});
            }

            const token = jwt.sign({
                id: usuario.id,
                login: usuario.login,
                papel: usuario.papel
            },
                process.env.JWT_SECRET,
                {expiresIn: '8h'}
            );

            res.status(200).json({
                token,
                usuario: {id: usuario.id, login: usuario.login, papel: usuario.papel}
            });
        } catch (err) {
            console.error('Erro no login:', err);
            res.status(500).json({erro: 'Erro interno no login'});
        }
    }
}