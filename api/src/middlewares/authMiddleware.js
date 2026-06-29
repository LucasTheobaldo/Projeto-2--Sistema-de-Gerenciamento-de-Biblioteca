const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({erro: 'Token não fornecido'});
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(401).json({erro: 'Formato de token inválido'});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (err) {
        return res.status(401).json({erro: 'Token inválido ou expirado'});
    }
};