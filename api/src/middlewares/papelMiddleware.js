const PAPEIS = {
    ADMIN: 1,
    BIBLIOTECARIO: 2,
    LEITOR: 3
};

function permitir(...papeisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({erro: 'Não autenticado'});
        }

        if (!papeisPermitidos.includes(req.usuario.papel)) {
            return res.status(403).json({erro: 'Sem permissão para esta ação'});
        }

        next();
    };
}

module.exports = {permitir, PAPEIS};